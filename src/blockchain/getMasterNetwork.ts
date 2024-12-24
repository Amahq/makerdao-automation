import { client, sequencerAbi, sequencerAddress } from "../modules/config";
import { decodeFromBytes32 } from "../modules/utils";

/**
 * Fetches the current master network name from the Sequencer contract.
 * @returns Promise<string> - The current master network name as a decoded string.
 */
export async function getMasterNetwork(): Promise<string> {
    try {
        const masterNetwork = await client.readContract({
            address: sequencerAddress,
            abi: sequencerAbi,
            functionName: 'getMaster',
        }) as string;

        const networkName = decodeFromBytes32(masterNetwork);
        console.log(`\n Current Master Network: ${networkName} \n`);
        return masterNetwork;
    } catch (error) {
        console.error('\n Error fetching master network:', error, '\n');
        throw new Error('Unable to fetch master network');
    }
}