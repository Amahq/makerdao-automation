import { client, sequencerAbi, sequencerAddress, jobAbi } from './config';
import { Address, Hex, padHex, stringToHex } from 'viem';
import { decodeFromBytes32, isContract } from './utils';
import { getMasterNetwork } from './sequencer';
import { promises } from 'dns';
import { workableJob } from '../Entities/workableJob';

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

export async function getNextJobs(network: string): Promise<{ job: string; canWork: boolean; args: string }[]> {
    try {
        //const network = `0x${Buffer.from(networkName).toString('hex').padEnd(64, '0')}`;
        const networkName = decodeFromBytes32(network);

        const nextJobs = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'getNextJobs',
            args: [network],
        });

        console.log(`Next jobs for network ${networkName}:`, nextJobs);
        return nextJobs as { job: string; canWork: boolean; args: string }[];
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
        const network = padHex(stringToHex(activeNetwork), { size: 32 });

        const [canWork, args] = await client.readContract({
            address: jobAddress,
            abi: jobAbi,
            functionName: 'workable',
            args: [network],
        });

        console.log(`Job ${jobAddress} is workable: ${canWork}`);
        console.log(`Additional data returned (args):`, args);
        return canWork;
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