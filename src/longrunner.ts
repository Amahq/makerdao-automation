import { fetchJobs } from './modules/jobs';
//import { updateLastWorkedBlocks } from './somewhere';
//import { checkInactivity } from './somewhere';

(async () => {
    const jobAddresses = await fetchJobs();
    async function runCycle() {
        //await updateLastWorkedBlocks(jobAddresses);
        //await checkInactivity(jobAddresses);
    }

    await runCycle();
    setInterval(runCycle, 5 * 60 * 1000); // every 5 minutes
})();
