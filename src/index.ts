import { getMasterNetwork, listNetworks } from './modules/sequencer';
import { testAllJobs, testJobWithNetwork } from './tests/testJobs';
import { fetchLerpFactoryCount } from './modules/utils';
import { fetchNetworkWindow, getTotalWindowSize } from './modules/networks';
import { fetchJobs, getNextJobs } from './modules/jobs';

import { Address, Hex } from 'viem';

async function main() {
    // Define the job address and LerpFactory address
    const lerpFactoryAddress: Address = '0x9175561733D138326FDeA86CdFdF53e92b588276'; // Replace with actual address

    try {

        // Define an array of job addresses to test
        const jobAddresses: Address[] = [
            '0x67AD4000e73579B9725eE3A149F85C4Af0A61361',
            '0x8F8f2FC1F0380B9Ff4fE5c3142d0811aC89E32fB',
            '0xc32506E9bB590971671b649d9B8e18CB6260559F',
            '0x7E93C4f61C8E8874e7366cDbfeFF934Ed089f9fF',
            '0xe717Ec34b2707fc8c226b34be5eae8482d06ED03',
            '0x2Ea4aDE144485895B923466B4521F5ebC03a0AeF',
            '0x0C86162ba3E507592fC8282b07cF18c7F902C401',
            '0x6464C34A02DD155dd0c630CE233DD6e21C24F9A5',
        ];

        // Fetch and display the current master network
        console.log('\n--- Fetching Current Master Network ---');
        const activeNetwork = await getMasterNetwork();
        console.log(`Active Master Network: ${activeNetwork}\n`);

        console.log("trying to get the nextjobs ");
        await getNextJobs(activeNetwork);

        // Fetch the LerpFactory count
        //console.log(`\n--- Fetching LerpFactory Count for: ${lerpFactoryAddress} ---`);
        //await fetchLerpFactoryCount(lerpFactoryAddress);

        // List all networks configured in the Sequencer
        //console.log('Listing all registered networks...');
        //await listNetworks();

        // Fetch window configuration for the current active network
        //console.log(`Fetching window configuration for network: ${activeNetwork}...`);
        //await fetchNetworkWindow(activeNetwork);

        // Get the total window size
        //console.log('Fetching total window size...');
        //await getTotalWindowSize();

        // Fetch all jobs and test their workability with the active master network
        console.log('Fetching jobs...');
        const jobs = await fetchJobs();

        console.log('\n--- Starting Job Checks for All Addresses ---\n');
        await testAllJobs(jobAddresses);

        /* console.log(`Testing all jobs with the active master network: ${activeNetwork}`);
        for (const job of jobs) {
            console.log(`Testing job ${job}...`);
            await testJobWithNetwork(job, activeNetwork as Hex);
        } */
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

// Wrap in an async IIFE to avoid top-level await issues
(async () => {
    await main();
})();
