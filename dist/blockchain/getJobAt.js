"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobAt = getJobAt;
const config_1 = require("../config");
const utils_1 = require("../utils");
/**
 * Fetches the indicated job from the Sequencer contract.
 * @param index - Index of the desired job.
 * @returns Promise<workableJob> - The obtained of jobs.
 */
async function getJobAt(index) {
    try {
        const job = (await config_1.client.readContract({
            address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS,
            abi: utils_1.sequencerAbi,
            functionName: 'jobAt',
            args: [index],
        }));
        return job;
    }
    catch (error) {
        const errMsg = `Error fetching job at index ${index}: ${error}`;
        console.error('\n', errMsg, '\n');
        throw new Error(`Error fetching job at index ${index}`);
    }
}
