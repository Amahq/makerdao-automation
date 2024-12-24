import { client, sequencerAbi, sequencerAddress, jobAbi } from './config';
import { Address, Hex, padHex, stringToHex } from 'viem';
import { decodeFromBytes32, encodeToBytes32, isContract } from './utils';
import { getMasterNetwork } from './sequencer';
import { workableJob } from '../Entities/workableJob';
import { updateLastWorkedBlockInStorage, getLastWorkedBlockFromStorage } from '../Persistence/storage';
import { sendDiscordAlert } from '../Discord/alerts';
import { erc20Abi } from 'viem';

const INACTIVITY_BLOCK_THRESHOLD = 100n;

export async function checkInactivity(jobAddresses: Address[]) {
    const currentBlock = await client.getBlockNumber();
    for (const job of jobAddresses) {
        const lastWorked = getLastWorkedBlockFromStorage(job);
        if (lastWorked === 0n) {
            // If we never recorded a work, assume it's inactive or handle gracefully.
            continue;
        }
        const blocksSinceWorked = currentBlock - lastWorked;
        if (blocksSinceWorked >= INACTIVITY_BLOCK_THRESHOLD) {
            await sendDiscordAlert(`Job ${job} has not been worked for ${blocksSinceWorked} blocks.`);
        }
    }
}


async function updateLastWorkedBlocks(jobAddresses: Address[]) {
    const latestBlock = await client.getBlockNumber();
    const blocksToSearchBack = 200n; // For example, search last 200 * ~15s = 50 min
    const fromBlock = latestBlock - blocksToSearchBack > 0n ? latestBlock - blocksToSearchBack : 0n;

    const logs = await fetchWorkEvents(jobAddresses, fromBlock, latestBlock);
    
    // parse logs: each log has a blockNumber and job address
    for (const log of logs) {
        const logBlock = BigInt(log.blockNumber);
        const currentStored = getLastWorkedBlockFromStorage(log.address);
        if (logBlock > currentStored) {
            updateLastWorkedBlockInStorage(log.address, logBlock);
        }
    }
}

export async function fetchAllWorkEvents(jobAddresses: Address) {

    /* const logs = await client.getContractEvents({
        address: jobAddresses,
        event: {
            type: 'event', // Specify the type as 'event'
            name: 'Work',
            inputs: [
                { type: 'bytes32', indexed: true }, // Network (indexed in the Solidity event)
                { type: 'bytes32', indexed: true }, // Ilk (indexed in the Solidity event)
            ],
        },
        fromBlock,
        toBlock,
    }); */

    const logs = await client.getContractEvents({ 
        address: jobAddresses,
        abi: erc20Abi,
        //eventName: 'Transfer'
        /* args: {
          from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
        },
        fromBlock: 16330000n,
        toBlock: 16330050n */
      })

    console.log("fetchWorkEvents - ", logs);
    return logs;
}

export async function fetchWorkEvents(jobAddresses: Address[], fromBlock: bigint, toBlock: bigint) {

    const logs = await client.getLogs({
        address: jobAddresses,
        event: {
            type: 'event', // Specify the type as 'event'
            name: 'Work',
            inputs: [
                { type: 'bytes32', indexed: true }, // Network (indexed in the Solidity event)
                { type: 'bytes32', indexed: true }, // Ilk (indexed in the Solidity event)
            ],
        },
        fromBlock,
        toBlock,
    });
    console.log("fetchWorkEvents - ", logs);
    return logs;
}


export async function fetchJobTimer(jobAddress: Address): Promise<void> {
    try {
        // Check if the `last` function exists in the contract
        const hasLastFunction = await client.simulateContract({
            address: jobAddress,
            abi: [
                {
                    type: 'function',
                    name: 'last',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ type: 'uint256' }],
                },
            ],
            functionName: 'last',
        }).then(() => true).catch(() => false);

        if (!hasLastFunction) {
            console.warn(`Skipping job ${jobAddress}: 'last()' function not found.`);
            return;
        }

        const last = await client.readContract({
            address: jobAddress,
            abi: [
                {
                    type: 'function',
                    name: 'last',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ type: 'uint256' }],
                },
            ],
            functionName: 'last',
        });

        const maxDuration = await client.readContract({
            address: jobAddress,
            abi: [
                {
                    type: 'function',
                    name: 'maxDuration',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ type: 'uint256' }],
                },
            ],
            functionName: 'maxDuration',
        });

        const currentTime = BigInt(Math.floor(Date.now() / 1000));

        console.log(`Job ${jobAddress}:`);
        console.log(`  Last Execution Time: ${last}`);
        console.log(`  Max Duration: ${maxDuration}`);
        console.log(`  Current Time: ${currentTime}`);
        console.log(`  Time Remaining: ${(last + maxDuration) - currentTime}`);
    } catch (error) {
        console.error(`Error fetching timer details for job ${jobAddress}:`, error);
    }
}

export async function getNextJobs(network: string): Promise<workableJob[]> {
    try {
        const networkName = decodeFromBytes32(network);

        const nextJobs = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'getNextJobs',
            args: [network],
        }) as workableJob[];

        const returnedValue: workableJob[] = [];
        console.log(`Next jobs for network ${networkName}:`);
        nextJobs.forEach(function (value) {
            var tempJob: workableJob = {
                job: encodeToBytes32(value.job) as Hex,
                canWork: value.canWork,
                args: decodeFromBytes32(value.args)
            }
            returnedValue.push(tempJob);
            console.log(`JobAddress : ${decodeFromBytes32(tempJob.job)}`);
            console.log(`canWork : ${tempJob.canWork}`);
            console.log(`args : ${decodeFromBytes32(tempJob.args)} (${tempJob.args})`);
        });
        //console.log(returnedValue);
        return returnedValue;
    } catch (error) {
        console.error('Error fetching next jobs:', error);
        throw error;
    }
}


/**
 * Fetches the list of job addresses from the Sequencer contract.
 * @returns Promise<Address[]> - A list of valid job contract addresses.
 */
export async function fetchJobs(): Promise<Address[]> {
    const jobCount = await client.readContract({
        address: sequencerAddress,
        abi: sequencerAbi,
        functionName: 'numJobs',
    });

    console.log(`\n Found ${jobCount} jobs.`);
    const jobs: Address[] = [];

    for (let i = 0n; i < (jobCount as bigint); i++) {
        try {
            const jobAddress = await client.readContract({
                address: sequencerAddress,
                abi: sequencerAbi,
                functionName: 'jobAt',
                args: [i],
            });

            const isValidContract = await isContract(jobAddress as Address);
            if (isValidContract) {
                jobs.push(jobAddress as Address);
                console.log(`Job ${i}: ${jobAddress}`);
            } else {
                console.warn(`Address at index ${i} is not a valid contract: ${jobAddress}`);
            }
        } catch (error) {
            console.error(`Error fetching job at index ${i}:`, error);
        }
    }
    console.log('\n');

    return jobs;
}

/**
 * Checks if a job is workable by dynamically fetching the current master network.
 * @param jobAddress - Address of the job contract.
 * @returns Promise<boolean> - True if the job is workable, false otherwise.
 */
export async function checkWorkable(jobAddress: Address): Promise<boolean> {
    try {

        const activeNetwork = await getMasterNetwork();
        //const network = padHex(stringToHex(activeNetwork), { size: 32 });
        const network = encodeToBytes32(activeNetwork) as Address;

        /* const [canWork, args] = await client.readContract({
            address: jobAddress,
            abi: jobAbi,
            functionName: 'workable',
            args: [network],
        }); */

        /* console.log(`Job ${jobAddress} is workable: ${canWork}`);
        console.log(`Additional data returned (args):`, args); */
        return false;
    } catch (error) {
        console.error(`Error checking workable for job ${jobAddress}:`, error);
        return false;
    }
}

export async function verifyIsMasterForJob(jobAddress: Address, network: Hex): Promise<void> {
    const networkName = decodeFromBytes32(network);
    try {
        console.log(`\n---------------------------------`);
        console.log('verifyIsMasterForJob - ', networkName, '(', network, ')\n');
        const isMaster = await client.readContract({
            address: sequencerAddress,
            abi: [
                {
                    type: 'function',
                    name: 'isMaster',
                    stateMutability: 'view',
                    inputs: [{ name: 'network', type: 'bytes32' }],
                    outputs: [{ type: 'bool' }],
                },
            ],
            functionName: 'isMaster',
            args: [network],
        });

        console.log(`For Job ${jobAddress}, is ${networkName} master? ${isMaster}`);
    } catch (error) {
        console.error(`Error checking isMaster for network ${networkName}:`, error);
    }
    console.log(`---------------------------------\n`);
}

// Add more job-related functions here
