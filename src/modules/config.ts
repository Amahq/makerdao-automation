import { createPublicClient, http, Address, Abi } from 'viem';
import { mainnet } from 'viem/chains';

export const RPC_URL = process.env.RPC_URL || '';

export const client = createPublicClient({
    chain: mainnet,
    transport: http(RPC_URL),
});

export const sequencerAddress: Address = '0x238b4E35dAed6100C6162fAE4510261f88996EC9';

export const sequencerAbi = [
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
        name: 'getNextJobs',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'network', type: 'bytes32' },
            { name: 'startIndex', type: 'uint256' },
            { name: 'endIndexExcl', type: 'uint256' },
        ],
        outputs: [
            {
                type: 'tuple[]', // Array of structs
                components: [
                    { name: 'job', type: 'address' },
                    { name: 'canWork', type: 'bool' },
                    { name: 'args', type: 'bytes' },
                ],
            },
        ],
    },
    {
        type: 'function',
        name: 'getNextJobs',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'network', type: 'bytes32' }],
        outputs: [
            {
                type: 'tuple[]', // Array of structs
                components: [
                    { name: 'job', type: 'address' },
                    { name: 'canWork', type: 'bool' },
                    { name: 'args', type: 'bytes' },
                ],
            },
        ],
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
];

// Job contract ABI
export const jobAbi = [
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