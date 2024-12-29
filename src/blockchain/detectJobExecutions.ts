import { Address } from 'viem'; // Import Address type for type safety
import { contractLog, jobLog } from '../entities'; // Import relevant entities for logging
import { getEvents } from './getEvents'; // Import utility to retrieve blockchain events

/**
 * Detects job executions by analyzing "Work" event logs for given job addresses.
 *
 * @param {Address[]} jobs - An array of job contract addresses to analyze.
 * @param {bigint} blocksToCheck - The number of recent blocks to look back for logs.
 * @returns {Promise<jobLog[]>} - A promise resolving to an array of job log objects
 *                                containing the number of work executions per job.
 *
 * @remarks
 * - This function fetches logs of the "Work" event from specified job addresses.
 * - The returned logs are aggregated into a summary of job executions.
 * - Extra logic to validate that the logs correspond specifically to the "Work" event is needed.
 */
export async function detectJobExecutions(
  jobs: Address[],
  blocksToCheck: bigint,
): Promise<jobLog[]> {
  // Initialize an object to store aggregated job logs keyed by job address
  let jobLogDone: { [id: string]: jobLog } = {};

  // Array to store the final job log summaries
  const returnedValue: jobLog[] = [];

  // Fetch logs for the "Work" events from the blockchain for the specified jobs
  const logs = (await getEvents(jobs, blocksToCheck)) as contractLog[];

  // Initialize job logs for each job address with zero work done
  jobs.forEach((job) => {
    jobLogDone[job.toLowerCase()] = { job: job, amountOfWorkDone: 0 };
  });

  // Iterate through the logs to aggregate the number of executions for each job
  logs.forEach((log) => {
    try {
      // Normalize address
      const lowerCaseAddress = log.address.toLowerCase();
      if (lowerCaseAddress && jobLogDone[lowerCaseAddress]) {
        // Increment the work done count for the job corresponding to the log address
        jobLogDone[lowerCaseAddress].amountOfWorkDone += 1;
      } else {
        throw new Error(`Log address ${log.address} does not match any job`);
      }
    } catch (error) {
      // Handle cases where the log address does not match a job address
      console.error('Error while processing job logs:', error);
    }
  });

  // Convert the aggregated job logs into an array for return
  jobs.forEach((job) => {
    returnedValue.push(jobLogDone[job.toLowerCase()]);
  });

  /**
   * NOTE: The function currently assumes all logs retrieved correspond to the "Work" event.
   * Extra logic should be added to explicitly validate that logs belong to this event.
   */

  return returnedValue;
}
