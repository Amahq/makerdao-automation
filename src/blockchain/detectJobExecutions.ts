import { Address } from 'viem';
import { ContractLog, JobLog } from '../entities';
import { getEvents } from './getEvents';

export async function detectJobExecutions(
  jobs: Address[],
  blocksToCheck: bigint,
): Promise<JobLog[]> {
  let jobLogDone: { [id: string]: JobLog } = {};
  const returnedValue: JobLog[] = [];

  //The job executions are obtained by getting all the logs of the "Work" events found in the jobs addresses.
  const logs = (await getEvents(jobs, blocksToCheck)) as ContractLog[];

  jobs.forEach((job) => {
    jobLogDone[job.toLowerCase()] = { job: job, amountOfWorkDone: 0 };
  });

  logs.forEach((log) => {
    try {
      jobLogDone[log.address].amountOfWorkDone += 1;
    } catch (error) {
      console.error('Error while testing jobs:', error);
    }
  });

  jobs.forEach((job) => {
    returnedValue.push(jobLogDone[job.toLowerCase()]);
  });

  //NOTE: Extra logic to validate that the events belong to the "Work" event needs to be added, i couldn't find a proper way to do this.

  return returnedValue;
}
