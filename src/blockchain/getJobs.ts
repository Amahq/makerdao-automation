import { Address } from "viem";
import { contract } from "../Entities/contract";
import { workableJob } from "../Entities/workableJob";
import { client, sequencerAbi, sequencerAddress } from "../modules/config";

/**
 * Fetches the indicated job from the Sequencer contract.
 * @param index - Index of the desired job.
 * @returns Promise<workableJob> - The obtained of jobs.
 */
export async function getJobs(amountOfJobs: bigint): Promise<Address[]> {
    try {

        var calls: contract[] =[] 
        for( let i = 0; i < amountOfJobs; i++){
            const call: contract = {
                address:sequencerAddress,
                abi:sequencerAbi,
                functionName:'jobAt',
                args:[i]
            }
            calls.push(call);
        }

        const results = await client.multicall(
            {
                contracts: calls,
                allowFailure: false,
            }
        ) as Address[]

        return results;
    } catch (error) {
        const errMsg = (`Error fetching job at index ${0}: ${error}`);
        console.error('\n', errMsg ,'\n');
        throw new Error(`Error fetching job at index ${0}`);
    }
}