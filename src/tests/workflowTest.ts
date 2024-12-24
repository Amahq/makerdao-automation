import {  Address } from "viem";
import { getMasterNetwork } from "../blockchain/getMasterNetwork";
import * as dotenv from 'dotenv';
import { getNumJobs } from "../blockchain/getNumJobs";
import { getJobs } from "../blockchain/getJobs";
import { getEvents } from "../blockchain/getEvents";
import { getContractAbi } from "../blockchain/getContractAbiEvent";
import { detectJobExecutions } from "../Logic/detectJobExecutions";


async function main() {
    dotenv.config();
    const masterNetwork = await getMasterNetwork();
    console.log("Master Network (", masterNetwork, ")");
    const numberOfJobs = await getNumJobs();
    console.log("Number of Jobs (", numberOfJobs, ")")

    //console.log("start test");
    const jobs = await getJobs(numberOfJobs);
    //console.log("test ended (", jobs);

    const jobEventsDetected = await detectJobExecutions(jobs, 1000n);
    console.log("Job events detected : ", jobEventsDetected)
    /* var interval = 100; // how much time should the delay between two iterations be (in milliseconds)?
    var promise = Promise.resolve();
    var detectedJobs = 0;
    jobs.forEach(async function(job){
        promise = promise.then(async function () {

            const newValue: Address[] = [job] 
            const contractAbi = await getContractAbi(job, "event", "Work");

            const logs = await getEvents(newValue, "Work", 1000n,contractAbi);
            detectedJobs += logs.length;
            console.log(`these are the logs obtained (${job}) -`, logs);
            return new Promise(function (resolve) {
              setTimeout(resolve, interval);
            });
          });
    })
    console.log(`There were ${detectedJobs} events in the specified interval`) */
}



main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});