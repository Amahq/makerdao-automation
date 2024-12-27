require('dotenv').config();
import { sendDiscordAlert } from './alerts/discord';
import { detectJobExecutions, getJobs, getNumJobs } from './blockchain';

async function main() {
  try {
    const numberOfJobs = await getNumJobs();
    const amountOfJobs = 170n;
    const jobs = await getJobs(numberOfJobs);

    const jobEventsDetected = await detectJobExecutions(jobs, amountOfJobs);

    let notificationMessage = '';
    let sendNotification = false;
    jobEventsDetected.forEach((job) => {
      if (job.amountOfWorkDone == 0) {
        sendNotification = true;
        notificationMessage += `\nThe job ${job.job} hasn't done any work on the last ${amountOfJobs} blocks...\n`;
      }
    });

    if (sendNotification) {
      sendDiscordAlert(notificationMessage);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

// Interval in milliseconds (e.g., 5 minutes = 5 * 60 * 1000 ms)
const intervalInMilliseconds = 14000; // Change this value to your desired interval
console.log('This message only appears before the interval');

// Start the interval
setInterval(() => {
  console.log('This message only appears inside the interval');

  main();
}, intervalInMilliseconds);

console.log('This message only appears after the interval');
