"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumJobs = getNumJobs;
const config_1 = require("../config");
const utils_1 = require("../utils");
/**
 * Fetches the current number of jobs from the Sequencer contract.
 * @returns Promise<number> - The current number of jobs as a number.
 */
async function getNumJobs() {
    try {
        const masterNetwork = (await config_1.client.readContract({
            address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS,
            abi: utils_1.sequencerAbi,
            functionName: 'numJobs',
        }));
        return masterNetwork;
    }
    catch (error) {
        console.error('\n Error getting the number of Jobs:', error, '\n');
        throw new Error('Unable to get the number of Jobs');
    }
}
