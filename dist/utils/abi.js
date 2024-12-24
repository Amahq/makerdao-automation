"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobAbi = exports.sequencerAbi = void 0;
exports.sequencerAbi = [
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
];
// A chequear esto *-*
// Job contract ABI
exports.jobAbi = [
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
];
