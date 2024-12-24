import * as dotenv from 'dotenv';
import { getNumJobs } from "../blockchain/getNumJobs";
import { getJobs } from "../blockchain/getJobs";
import { detectJobExecutions } from "../Logic/detectJobExecutions";
import { sendDiscordAlert } from "../Discord/alerts";


async function main() {
    dotenv.config();

    const numberOfJobs = await getNumJobs();

    const jobs = await getJobs(numberOfJobs);

    const jobEventsDetected = await detectJobExecutions(jobs, 100n);

    var notificationMessage = ""
    var sendNotification = false
    jobEventsDetected.forEach(job =>{
      if(job.amountOfWorkDone == 0){
        sendNotification = true
        notificationMessage += `\nThe job ${job.job} hasn't done any work on the last 100 blocks...\n`
      }
    })

    if (sendNotification){
      sendDiscordAlert(notificationMessage);
    }

}



main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});