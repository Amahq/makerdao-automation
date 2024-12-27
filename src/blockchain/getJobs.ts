import { Address } from 'viem';
import { sequencerAbi } from '../utils';
import { client, getEnvs } from '../config';
import { contract } from '../entities';

/**
 * Fetches the indicated job from the Sequencer contract.
 * @param index - Index of the desired job.
 * @returns Promise<workableJob> - The obtained of jobs.
 */
export async function getJobs(amountOfJobs: bigint): Promise<Address[]> {
  try {
    let calls: contract[] = [];
    for (let i = 0; i < amountOfJobs; i++) {
      const call: contract = {
        address: getEnvs().SEQUENCER_ADDRESS as Address,
        abi: sequencerAbi,
        functionName: 'jobAt',
        args: [i],
      };
      calls.push(call);
    }

    const results = (await client.multicall({
      contracts: calls,
      allowFailure: false,
    })) as Address[];

    return results;
  } catch (error) {
    const errMsg = `Error fetching job at index ${0}: ${error}`;
    console.error('\n', errMsg, '\n');
    throw new Error(`Error fetching job at index ${0}`);
  }
}
