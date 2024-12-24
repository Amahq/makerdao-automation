import { Address } from "viem";
import { getEvents } from "../blockchain/getEvents";
import { contractEvent } from "../Entities/contractEvent";
import { contractLog } from "../Entities/contractLog";
import { decodeFromBytes32 } from "../modules/utils";
import { TokenIsEthError } from "viem/_types/zksync/errors/token-is-eth";
import { jobLog } from "../Entities/jobLog";

export async function detectJobExecutions(jobs: Address[], blocksToCheck: bigint): Promise<jobLog[]> {

    var jobLogDone: {[id:string]: jobLog} = {}
    const returnedValue:jobLog[]=[]
    const logs =  await getEvents(jobs, "Work", blocksToCheck) as contractLog[]; //The job executions are obtained by getting all the logs of the "Work" events found in the jobs addresses.
    jobs.forEach(job => {
      jobLogDone[job.toLowerCase()] = {job: job, amountOfWorkDone: 0}
    });
    logs.forEach(log => {
      try{
        jobLogDone[log.address].amountOfWorkDone += 1;
      } catch (error) {
        console.error('Error while testing jobs:', error);
    }
    })
    jobs.forEach(job =>{
      returnedValue.push(jobLogDone[job.toLowerCase()]);
    })

    //NOTE: Extra logic to validate that the events belong to the "Work" event needs to be added, i couldn't find a proper way to do this.

    return returnedValue;
}
