require('dotenv').config();
import { sendDiscordAlert } from '../alerts/discord';
import { detectJobExecutions, getJobs, getNumJobs } from '../blockchain';

async function main() {
  const numberOfJobs = await getNumJobs();

  const jobs = await getJobs(numberOfJobs);

  const jobEventsDetected = await detectJobExecutions(jobs, 100n);

  let notificationMessage = '';
  let sendNotification = false;
  jobEventsDetected.forEach((job) => {
    if (job.amountOfWorkDone == 0) {
      sendNotification = true;
      notificationMessage += `\nThe job ${job.job} hasn't done any work on the last 100 blocks...\n`;
    }
  });

  if (sendNotification) {
    sendDiscordAlert(notificationMessage);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
