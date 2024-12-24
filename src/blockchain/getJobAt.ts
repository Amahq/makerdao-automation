import { workableJob } from "../Entities/workableJob";
import { client, sequencerAbi, sequencerAddress } from "../modules/config";

/**
 * Fetches the indicated job from the Sequencer contract.
 * @param index - Index of the desired job.
 * @returns Promise<workableJob> - The obtained of jobs.
 */
export async function getJobAt(index: number): Promise<workableJob> {
    try {
        const job = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'jobAt',
            args: [index]
        }) as workableJob;
        return job;
    } catch (error) {
        const errMsg = (`Error fetching job at index ${index}: ${error}`);
        console.error('\n', errMsg ,'\n');
        throw new Error(`Error fetching job at index ${index}`);
    }
}