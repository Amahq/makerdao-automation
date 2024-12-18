
import { client, sequencerAbi, sequencerAddress } from './config';
import { Hex } from 'viem';
import { decodeFromBytes32 } from './utils';

/**
 * Fetches all registered networks and their window details from the Sequencer contract.
 */
export async function listNetworks(): Promise<string[]> {
    const networks: string[] = [];
    try {
        const totalNetworks = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'numNetworks',
        });

        console.log(`\n Total Registered Networks: ${totalNetworks}`);

        for (let i = 0n; i < (totalNetworks as bigint); i++) {
            const network = await client.readContract({
                address: sequencerAddress,
                abi: sequencerAbi,
                functionName: 'networkAt',
                args: [i],
            }) as string;

            const decodedNetwork = decodeFromBytes32(network);
            networks.push(decodedNetwork);
            console.log(`Network ${i}: ${decodedNetwork}`);
        }
        console.log('\n');
    } catch (error) {
        console.error('\n Error fetching networks:', error, '\n');
    }
    return networks;
};

/**
 * Fetches the current master network name from the Sequencer contract.
 * @returns Promise<string> - The current master network name as a decoded string.
 */
export async function getMasterNetwork(): Promise<string> {
    try {
        const masterNetwork = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'getMaster',
        }) as string;

        const networkName = decodeFromBytes32(masterNetwork);
        console.log(`\n Current Master Network: ${networkName} \n`);
        return masterNetwork;
    } catch (error) {
        console.error('\n Error fetching master network:', error, '\n');
        throw new Error('Unable to fetch master network');
    }
}

/**
 * Checks if a network is recognized as the master network in the Sequencer.
 * @param networkName - The name of the network to check.
 */
export async function verifyIsMaster(networkName: string): Promise<void> {
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
}

// Add more Sequencer-related functions here
