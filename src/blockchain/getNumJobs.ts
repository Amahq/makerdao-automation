import { client, sequencerAbi, sequencerAddress } from "../modules/config";

/**
 * Fetches the current number of jobs from the Sequencer contract.
 * @returns Promise<number> - The current number of jobs as a number.
 */
export async function getNumJobs(): Promise<bigint> {
    try {
        const masterNetwork = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'numJobs',
        }) as bigint;
        return masterNetwork;
    } catch (error) {
        console.error('\n Error getting the number of Jobs:', error, '\n');
        throw new Error('Unable to get the number of Jobs');
    }
}