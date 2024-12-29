"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobAt = getJobAt;
const config_1 = require("../config");
const utils_1 = require("../utils");
/**
 * Fetches a specific job from the Sequencer contract by its index.
 *
 * This function interacts with the Sequencer contract to retrieve details
 * of a job located at the specified index. The Sequencer contract's address
 * and ABI are configured via environment variables and utilities.
 *
 * @param {number} index - The index of the desired job in the Sequencer contract.
 * @returns {Promise<workableJob>} - A promise resolving to the job details.
 *
 * @throws {Error} If the contract call fails, an error is logged and rethrown.
 *
 * @example
 * const job = await getJobAt(0);
 * console.log(job); // Outputs the details of the job at index 0
 */
async function getJobAt(index) {
    try {
        // Fetch job details from the Sequencer contract
        const job = (await config_1.client.readContract({
            address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS, // Sequencer contract address from environment
            abi: utils_1.sequencerAbi, // ABI for the Sequencer contract
            functionName: 'jobAt', // Contract function to fetch a job by index
            args: [index], // Pass the index as an argument
        }));
        return job; // Return the fetched job details
    }
    catch (error) {
        const errMsg = `Error fetching job at index ${index}: ${error}`; // Error message template
        console.error('\n', errMsg, '\n'); // Log the error for debugging
        throw new Error(`Error fetching job at index ${index}`); // Rethrow the error
    }
}
