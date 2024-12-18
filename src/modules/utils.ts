import { Address } from 'viem';
import { client } from './config';

export function encodeToBytes32(input: string): string {
    return `0x${Buffer.from(input).toString('hex').padEnd(64, '0')}`;
}

/**
 * Decode bytes32 hex to UTF-8 string and remove null bytes
 * @param input - The string to be Decoded
 * @returns String - a decoded string.
 */
export function decodeFromBytes32(input: string): string {
    const decodedValue = Buffer.from(input.slice(2), 'hex')
        .toString('utf8')
        .replace(/\0/g, '');
    return decodedValue;
}

export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if an address is a deployed contract by verifying its bytecode.
 * @param address - The Ethereum address to check.
 * @returns Promise<boolean> - True if the address has deployed bytecode, otherwise false.
 */
export async function isContract(address: Address): Promise<boolean> {
    const code = await client.getCode({ address });
    return code !== undefined && code !== '0x';
}

export async function fetchLerpFactoryCount(lerpFactoryAddress: Address): Promise<void> {
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

        console.log(`\n LerpFactory Count: ${count} \n`);
    } catch (error) {
        console.error('\n Error fetching LerpFactory count:', error, '\n');
    }
}

// Add more utility functions here
