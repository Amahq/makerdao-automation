import { Address } from 'viem';
import { client, getEnvs } from '../config';
import { sequencerAbi } from '../utils';

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
export async function getNumJobs(): Promise<bigint> {
  try {
    // Fetch the total number of jobs from the Sequencer contract
    const masterNetwork = (await client.readContract({
      address: getEnvs().SEQUENCER_ADDRESS as Address, // Sequencer contract address from environment
      abi: sequencerAbi, // ABI for the Sequencer contract
      functionName: 'numJobs', // Contract function to fetch the number of jobs
    })) as bigint;

    return masterNetwork; // Return the fetched number of jobs
  } catch (error) {
    console.error('\n Error getting the number of Jobs:', error, '\n'); // Log the error for debugging
    throw new Error('Unable to get the number of Jobs'); // Rethrow the error
  }
}
