"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = getJobs;
const utils_1 = require("../utils");
const config_1 = require("../config");
/**
 * Fetches the list of jobs from the Sequencer contract using multicall.
 *
 * This function constructs multiple contract calls to fetch jobs from the
 * Sequencer contract by their index and executes them in a single multicall.
 *
 * @param {bigint} amountOfJobs - The total number of jobs to fetch.
 * @returns {Promise<Address[]>} - A promise resolving to an array of job addresses.
 *
 * @throws {Error} If the multicall fails, an error is logged and rethrown.
 *
 * @example
 * const jobs = await getJobs(10n);
 * console.log(jobs); // Outputs an array of job addresses
 */
async function getJobs(amountOfJobs) {
    try {
        let calls = [];
        // Construct a multicall for each job index
        for (let i = 0; i < amountOfJobs; i++) {
            const call = {
                address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS, // Address of the Sequencer contract
                abi: utils_1.sequencerAbi, // ABI for the Sequencer contract
                functionName: 'jobAt', // Function to fetch job by index
                args: [i], // Index of the job
            };
            calls.push(call);
        }
        // Execute all calls in a single multicall
        const results = (await config_1.client.multicall({
            contracts: calls,
            allowFailure: false, // Fail the call if any contract invocation fails
        }));
        return results; // Return the array of job addresses
    }
    catch (error) {
        const errMsg = `Error fetching job at index 0: ${error}`; // Error message template
        console.error('\n', errMsg, '\n'); // Log the error for debugging
        throw new Error(`Error fetching job at index 0`); // Rethrow the error
    }
}
