"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectJobExecutions = detectJobExecutions;
const getEvents_1 = require("./getEvents"); // Import utility to retrieve blockchain events
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
async function detectJobExecutions(jobs, blocksToCheck) {
    // Initialize an object to store aggregated job logs keyed by job address
    let jobLogDone = {};
    // Array to store the final job log summaries
    const returnedValue = [];
    // Fetch logs for the "Work" events from the blockchain for the specified jobs
    const logs = (await (0, getEvents_1.getEvents)(jobs, blocksToCheck));
    // Initialize job logs for each job address with zero work done
    jobs.forEach((job) => {
        jobLogDone[job.toLowerCase()] = { job: job, amountOfWorkDone: 0 };
    });
    // Iterate through the logs to aggregate the number of executions for each job
    logs.forEach((log) => {
        try {
            // Increment the work done count for the job corresponding to the log address
            jobLogDone[log.address].amountOfWorkDone += 1;
        }
        catch (error) {
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
