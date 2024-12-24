"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvs = exports.client = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const env_1 = require("./env");
exports.client = (0, viem_1.createPublicClient)({
    batch: {
        multicall: true,
        //wait: 0, // The maximum number of milliseconds to wait before sending a batch. - Default 0
        //batchSize: 512, // Check if the provider has limits and use this accordingly - Default 1_024
    },
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)('https://mainnet.infura.io/v3/4606cb2948614630a5adc14dc6031831'),
});
const getEnvs = () => {
    return env_1.envs;
};
exports.getEnvs = getEnvs;
