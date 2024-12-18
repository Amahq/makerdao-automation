import { createPublicClient, http, Address, Abi, stringToHex, padHex, Hex } from 'viem';
import { mainnet } from 'viem/chains';
import dotenv from 'dotenv';
/* module.exports = {
    listNetworks,
    getMasterNetwork,
    testJobWithNetwork,
    fetchNetworkWindow,
    getTotalWindowSize,
    fetchJobs,
    checkWorkable,
    verifyIsMaster,
    verifyIsMasterForJob,
    fetchJobTimer,
    fetchLerpFactoryCount,
    testAllJobs,
}; */


dotenv.config();

const RPC_URL = process.env.RPC_URL || '';

// Initialize the Viem client
const client = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL),
});

// Sequencer contract details
const sequencerAddress: Address = '0x238b4E35dAed6100C6162fAE4510261f88996EC9';

const sequencerAbi = [
    {
        type: 'function',
        name: 'getMaster',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'bytes32' }],
    },
    {
        type: 'function',
        name: 'numJobs',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'jobAt',
        stateMutability: 'view',
        inputs: [{ name: 'index', type: 'uint256' }],
        outputs: [{ type: 'address' }],
    },
    {
        type: 'function',
        name: 'numNetworks',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'networkAt',
        stateMutability: 'view',
        inputs: [{ name: 'index', type: 'uint256' }],
        outputs: [{ type: 'bytes32' }],
    },
] as const satisfies Abi;


// Job contract ABI
const jobAbi = [
    {
        type: 'function',
        name: 'workable',
        stateMutability: 'view',
        inputs: [{ name: 'network', type: 'bytes32' }],
        outputs: [
            { name: 'canWork', type: 'bool' },
            { name: 'args', type: 'bytes' },
        ],
    },
] as const satisfies Abi;

/**
 * Fetches all registered networks and their window details from the Sequencer contract.
 */
/* export async function listNetworks(): Promise<string[]> {
    const networks: string[] = [];
    try {
        const totalNetworks = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'numNetworks',
        });

        console.log(`Total Registered Networks: ${totalNetworks}`);

        for (let i = 0n; i < (totalNetworks as bigint); i++) {
            const network = await client.readContract({
                address: sequencerAddress,
                abi: sequencerAbi,
                functionName: 'networkAt',
                args: [i],
            });

            const decodedNetwork = Buffer.from(network.slice(2), 'hex')
                .toString('utf8')
                .replace(/\0/g, '');
            networks.push(decodedNetwork);
            console.log(`Network ${i}: ${decodedNetwork}`);
        }
    } catch (error) {
        console.error('Error fetching networks:', error);
    }
    return networks;
}; */



/**
 * Fetches the current master network name from the Sequencer contract.
 * @returns Promise<string> - The current master network name as a decoded string.
 */
/* export async function getMasterNetwork(): Promise<string> {
    try {
        const masterNetwork = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'getMaster',
        });

        // Decode bytes32 hex to UTF-8 string and remove null bytes
        const networkName = Buffer.from(masterNetwork.slice(2), 'hex')
            .toString('utf8')
            .replace(/\0/g, '');
        console.log(`Current Master Network: ${networkName}`);
        return masterNetwork;
    } catch (error) {
        console.error('Error fetching master network:', error);
        throw new Error('Unable to fetch master network');
    }
} */

/**
 * Tests if a job is workable for a specific network name.
 * @param jobAddress - Address of the job contract.
 * @param networkName - Name of the network to test.
 */
/* export async function testJobWithNetwork(jobAddress: Address, networkName: string): Promise<void> {
    try {

        const network = networkName as Hex;

        // Call the workable function
        const [canWork, args] = await client.readContract({
            address: jobAddress,
            abi: jobAbi,
            functionName: 'workable',
            args: [network],
        });

        console.log(`Testing Job: ${jobAddress} with Network: ${networkName}`);
        console.log(`Workable: ${canWork}`);
        console.log(`Additional data (args): ${Buffer.from(args.slice(2), 'hex').toString('utf8')}`);
    } catch (error) {
        console.error(`Error testing job ${jobAddress} with network ${networkName}:`, error);
    }
} */

/**
 * Fetches the window configuration for a specific network.
 * @param networkName - The name of the network to check.
 */
/* export async function fetchNetworkWindow(networkName: string): Promise<void> {
    try {
        const network = networkName as Hex;

        const window = await client.readContract({
            address: sequencerAddress,
            abi: [
                {
                    type: 'function',
                    name: 'windows',
                    stateMutability: 'view',
                    inputs: [{ name: 'network', type: 'bytes32' }],
                    outputs: [
                        { name: 'start', type: 'uint256' },
                        { name: 'length', type: 'uint256' },
                    ],
                },
            ],
            functionName: 'windows',
            args: [network],
        });

        console.log(`Network: ${networkName}`);
        console.log(`Start: ${window[0]}`);
        console.log(`Length: ${window[1]}`);
    } catch (error) {
        console.error(`Error fetching window for network ${networkName}:`, error);
    }
} */

/* export async function getTotalWindowSize(): Promise<void> {
    try {
        const totalWindowSize = await client.readContract({
            address: sequencerAddress,
            abi: [
                {
                    type: 'function',
                    name: 'totalWindowSize',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ type: 'uint256' }],
                },
            ],
            functionName: 'totalWindowSize',
        });

        console.log(`Total Window Size: ${totalWindowSize}`);
    } catch (error) {
        console.error('Error fetching total window size:', error);
    }
}
 */

/**
 * Checks if an address is a deployed contract by verifying its bytecode.
 * @param address - The Ethereum address to check.
 * @returns Promise<boolean> - True if the address has deployed bytecode, otherwise false.
 */
/* export async function isContract(address: Address): Promise<boolean> {
    const code = await client.getCode({ address });
    return code !== undefined && code !== '0x';
} */

/**
 * Fetches the list of job addresses from the Sequencer contract.
 * @returns Promise<Address[]> - A list of valid job contract addresses.
 */
/* export async function fetchJobs(): Promise<Address[]> {
    const jobCount = await client.readContract({
        address: sequencerAddress,
        abi: sequencerAbi,
        functionName: 'numJobs',
    });

    console.log(`Found ${jobCount} jobs.`);
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

    return jobs;
} */

/**
 * Checks if a job is workable by dynamically fetching the current master network.
 * @param jobAddress - Address of the job contract.
 * @returns Promise<boolean> - True if the job is workable, false otherwise.
 */
/* export async function checkWorkable(jobAddress: Address): Promise<boolean> {
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
} */

/**
 * Checks if a network is recognized as the master network in the Sequencer.
 * @param networkName - The name of the network to check.
 */
/* export async function verifyIsMaster(networkName: string): Promise<void> {
    try {

        const network = networkName as Hex;

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

        console.log(`Is ${networkName} master? ${isMaster}`);
    } catch (error) {
        console.error(`Error verifying isMaster for network ${networkName}:`, error);
    }
} */

/* export async function verifyIsMasterForJob(jobAddress: Address, networkName: string): Promise<void> {
    try {
        const network = networkName as Hex;
        console.log('verifyIsMasterForJob - ', network);
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
} */

/* export async function fetchJobTimer(jobAddress: Address): Promise<void> {
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
} */



/* export async function fetchLerpFactoryCount(lerpFactoryAddress: Address): Promise<void> {
    try {
        const count = await client.readContract({
            address: lerpFactoryAddress,
            abi: [
                {
                    type: 'function',
                    name: 'count',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ type: 'uint256' }],
                },
            ],
            functionName: 'count',
        });

        console.log(`LerpFactory Count: ${count}`);
    } catch (error) {
        console.error('Error fetching LerpFactory count:', error);
    }
} */

/**
 * Tests an array of job addresses with the current master network.
 * @param jobAddresses - An array of job addresses to test.
 */
/* export async function testAllJobs(jobAddresses: Address[]): Promise<void> {
    try {
        // Fetch the active master network
        const activeNetwork = await getMasterNetwork();
        console.log(`\n--- Testing All Jobs with Active Master Network: ${activeNetwork} ---\n`);

        for (const jobAddress of jobAddresses) {
            console.log(`\nTesting Job Address: ${jobAddress} ---`);

            // Verify isMaster for the job
            console.log(`Verifying if ${activeNetwork} is master for job: ${jobAddress}`);
            await verifyIsMasterForJob(jobAddress, activeNetwork);

            // Fetch job timer details
            console.log(`Fetching timer details for job: ${jobAddress}`);
            await fetchJobTimer(jobAddress);

            // Test job with the active network
            console.log(`Testing workability for job: ${jobAddress} with network: ${activeNetwork}`);
            await testJobWithNetwork(jobAddress, activeNetwork);
        }
    } catch (error) {
        console.error('Error while testing jobs:', error);
    }
} */
