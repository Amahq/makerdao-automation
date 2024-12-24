"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = getJobs;
const utils_1 = require("../utils");
const config_1 = require("../config");
/**
 * Fetches the indicated job from the Sequencer contract.
 * @param index - Index of the desired job.
 * @returns Promise<workableJob> - The obtained of jobs.
 */
async function getJobs(amountOfJobs) {
    try {
        let calls = [];
        for (let i = 0; i < amountOfJobs; i++) {
            const call = {
                address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS,
                abi: utils_1.sequencerAbi,
                functionName: 'jobAt',
                args: [i],
            };
            calls.push(call);
        }
        const results = (await config_1.client.multicall({
            contracts: calls,
            allowFailure: false,
        }));
        return results;
    }
    catch (error) {
        const errMsg = `Error fetching job at index ${0}: ${error}`;
        console.error('\n', errMsg, '\n');
        throw new Error(`Error fetching job at index ${0}`);
    }
}
