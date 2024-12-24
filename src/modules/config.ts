import { createPublicClient, http, Address, Abi } from 'viem';
import { mainnet } from 'viem/chains';

export const RPC_URL = process.env.RPC_URL || '';
export const etherscan_apikey = process.env.ETHERSCAN_API_KEY || '';


export const client = createPublicClient({
    batch: {
        multicall: true
        //wait: 0, // The maximum number of milliseconds to wait before sending a batch. - Default 0
        //batchSize: 512, // Check if the provider has limits and use this accordingly - Default 1_024
    },
    chain: mainnet,
    transport: http("https://mainnet.infura.io/v3/4606cb2948614630a5adc14dc6031831"),
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
] satisfies Abi;

// Job contract ABI
export const jobAbi = [
    {
        type: 'function',
        name: 'work',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'network', type: 'bytes32' },
            { name: 'args', type: 'bytes' },
        ],
        outputs: [],
    },
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
    {
        type: 'event',
        name: 'Work',
        inputs: [
            { name: 'network', type: 'bytes32', indexed: true },
            { name: 'ilk', type: 'bytes32', indexed: true },
        ],
        anonymous: false,
    },
] satisfies Abi;