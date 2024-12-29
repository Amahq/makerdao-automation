"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumJobs = getNumJobs;
const config_1 = require("../config");
const utils_1 = require("../utils");
/**
 * Fetches the current number of jobs from the Sequencer contract.
 *
 * This function interacts with the Sequencer contract to retrieve the total
 * number of jobs currently available. The Sequencer contract's address and ABI
 * are configured via environment variables and utility imports.
 *
 * @returns {Promise<bigint>} - A promise resolving to the total number of jobs as a `bigint`.
 *
 * @throws {Error} If the contract call fails, an error is logged and rethrown.
 *
 * @example
 * const numJobs = await getNumJobs();
 * console.log(numJobs); // Outputs the total number of jobs as a bigint
 */
async function getNumJobs() {
    try {
        // Fetch the total number of jobs from the Sequencer contract
        const masterNetwork = (await config_1.client.readContract({
            address: (0, config_1.getEnvs)().SEQUENCER_ADDRESS, // Sequencer contract address from environment
            abi: utils_1.sequencerAbi, // ABI for the Sequencer contract
            functionName: 'numJobs', // Contract function to fetch the number of jobs
        }));
        return masterNetwork; // Return the fetched number of jobs
    }
    catch (error) {
        console.error('\n Error getting the number of Jobs:', error, '\n'); // Log the error for debugging
        throw new Error('Unable to get the number of Jobs'); // Rethrow the error
    }
}
