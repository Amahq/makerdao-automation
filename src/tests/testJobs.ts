import { Address, Hex } from "viem";
import { getMasterNetwork } from "../modules/sequencer";
import { verifyIsMasterForJob, fetchJobTimer } from "../modules/jobs";
import { client, jobAbi } from "../modules/config";
import { decodeFromBytes32 } from "../modules/utils";

/**
 * Tests an array of job addresses with the current master network.
 * @param jobAddresses - An array of job addresses to test.
 */
export async function testAllJobs(jobAddresses: Address[]): Promise<void> {
    try {
        // Fetch the active master network
        const activeNetwork = await getMasterNetwork();
        const activeNetworkDecoded = decodeFromBytes32(activeNetwork);
        console.log(`\n--- Testing All Jobs with Active Master Network: ${activeNetworkDecoded} ---\n`);

        for (const jobAddress of jobAddresses) {
            console.log(`<--------------------------------->`);
            console.log(`\nTesting Job Address: ${jobAddress} ---\n`);

            // Verify isMaster for the job
            console.log(`Verifying if ${activeNetworkDecoded} is master for job: ${jobAddress} \n`);
            await verifyIsMasterForJob(jobAddress, activeNetwork as Hex);

            // Fetch job timer details
            console.log(`Fetching timer details for job: ${jobAddress} \n`);
            await fetchJobTimer(jobAddress);

            // Test job with the active network
            console.log(`Testing workability for job: ${jobAddress} with network: ${activeNetworkDecoded} \n`);
            await testJobWithNetwork(jobAddress, activeNetwork as Hex);
            console.log(`<---------------------------------/>\n`);

        }
    } catch (error) {
        console.error('Error while testing jobs:', error);
    }
}

/**
 * Tests if a job is workable for a specific network name.
 * @param jobAddress - Address of the job contract.
 * @param networkName - Name of the network to test.
 */
export async function testJobWithNetwork(jobAddress: Address, network: Hex): Promise<void> {
    const networkName = decodeFromBytes32(network);
    try {

        const decodedNetwork = decodeFromBytes32(network);

        // Call the workable function
        const [canWork, args] = await client.readContract({
            address: jobAddress,
            abi: jobAbi,
            functionName: 'workable',
            args: [network],
        });

        console.log(`Testing Job: ${jobAddress} with Network: ${networkName} (${network})`);
        console.log(`Workable: ${canWork}`);
        console.log(`Additional data (args): ${decodeFromBytes32(args)}`);

    } catch (error) {
        console.error(`Error testing job ${jobAddress} with network ${networkName}:`, error);
    }
}