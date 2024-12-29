require('dotenv').config();
import { sendDiscordAlert } from './alerts/discord';
import { detectJobExecutions, getJobs, getNumJobs } from './blockchain';

/**
 * Main function to monitor jobs on the Sequencer contract.
 *
 * This function performs the following:
 * 1. Fetches the total number of jobs from the Sequencer contract.
 * 2. Retrieves the list of job addresses.
 * 3. Detects job executions within the last specified number of blocks.
 * 4. Sends a Discord alert if any job hasn't performed work during the monitored period.
 *
 * @throws {Error} Logs any unexpected errors encountered during execution.
 */
async function main() {
  try {
    // Fetch the total number of jobs
    const numberOfJobs = await getNumJobs();

    // Define the block range to monitor
    const amountOfBlocks = 100n;

    // Fetch the list of job addresses
    const jobs = await getJobs(numberOfJobs);

    // Detect job executions in the last `amountOfBlocks` blocks
    const jobEventsDetected = await detectJobExecutions(jobs, amountOfBlocks);

    // Build the notification message if jobs are idle
    let notificationMessage = '';
    let sendNotification = false;
    jobEventsDetected.forEach((job) => {
      if (job.amountOfWorkDone == 0) {
        sendNotification = true;
        notificationMessage += `\nThe job ${job.job} hasn't done any work on the last ${amountOfBlocks} blocks...\n`;
      }
    });

    // Send a Discord alert if any jobs are idle
    if (sendNotification) {
      sendDiscordAlert(notificationMessage);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error); // Log unexpected errors
  }
}

// Interval in milliseconds (e.g., 5 minutes = 5 * 60 * 1000 ms)
const intervalInMilliseconds = parseInt(
  process.env.EXECUTION_INVERTAL as string,
  10,
); // Change this value to your desired interval

/**
 * Starts the monitoring process at a regular interval.
 *
 * The `main` function is executed repeatedly at the specified interval
 * to monitor job activity and send alerts when necessary.
 */
setInterval(() => {
  main();
}, intervalInMilliseconds);
