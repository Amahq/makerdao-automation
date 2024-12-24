import { client, sequencerAbi, sequencerAddress } from "../modules/config";
import { decodeFromBytes32 } from "../modules/utils";

/**
 * Fetches the current master network and the number of jobs from the Sequencer contract in a single multicall.
 * @returns Promise<{ masterNetwork: string; numJobs: bigint }> - An object containing the master network and the number of jobs.
 */
//export async function getMasterNetworkAndNumJobs(): Promise<{ masterNetwork: string; numJobs: bigint }> {
export async function getMasterNetworkAndNumJobs(): Promise<any> {

    try {

        const testContract = {
            address: sequencerAddress,
            abi: sequencerAbi
        };

        // Execute multicall
        const results = await client.multicall({
            contracts: [
                {
                    address: sequencerAddress,
                    abi: sequencerAbi,
                    //...testContract,
                    functionName: 'getMaster',
                    args: []
                },
                {
                    ...testContract,
                    functionName: 'numJobs',
                    args: []
                }
            ],
            allowFailure: false, // Throw an error if any call fails
        });

        console.log(results)
        // Decode results
        //const masterNetworkRaw = results[0].result as string;
        //const numJobs = results[1].result as bigint;

        // Decode the master network from bytes32
        //const masterNetwork = decodeFromBytes32(masterNetworkRaw);

        //console.log(`\n Current Master Network: ${masterNetwork}`);
        //console.log(`\n Number of Jobs: ${numJobs}`);

        //return { masterNetwork, numJobs };
        return results;
    } catch (error) {
        console.error('\n Error in multicall fetching master network and number of jobs:', error, '\n');
        throw new Error('Unable to fetch master network and number of jobs');
    }
}
