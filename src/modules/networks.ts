import { client, sequencerAddress, sequencerAbi } from './config';
import { Hex } from 'viem';


/**
 * Fetches the window configuration for a specific network.
 * @param networkName - The name of the network to check.
 */
export async function fetchNetworkWindow(networkName: string): Promise<void> {
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

        console.log(`\n Network: ${networkName}`);
        console.log(`Start: ${window[0]}`);
        console.log(`Length: ${window[1]} \n`);
    } catch (error) {
        console.error(`Error fetching window for network ${networkName}:`, error);
    }
}

export async function getTotalWindowSize(): Promise<void> {
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

        console.log(`\n Total Window Size: ${totalWindowSize} \n`);
    } catch (error) {
        console.error('Error fetching total window size:', error);
    }
}

// Add more network-related functions here
