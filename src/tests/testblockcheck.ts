import { client } from '../modules/config'; // Adjust the path if needed
import { fetchWorkEvents, getNextJobs } from '../modules/jobs'; // Path to the fetchWorkEvents function
import { Address, Hex } from 'viem';
import { getMasterNetwork } from '../modules/sequencer';
import { decodeFromBytes32, encodeToBytes32 } from '../modules/utils';
import { workableJob } from '../Entities/workableJob';

async function main() {
    try {
        // Fetch the latest block
        const latestBlock = await client.getBlockNumber();
        const activeNetwork = await getMasterNetwork();
        const jobs = await getNextJobs(activeNetwork);

        const jobAddresses: Address[] = [];
        jobs.forEach(function (value) {
            jobAddresses.push(value.job);
        })
        console.log(`Latest Block: ${latestBlock}`);

        // Define the range to search for logs
        const pages = 200
        const blockOffset = 1n
        //const page = 5n

        for (var page = 1n; page < pages; page++) {
            const fromBlock = latestBlock - (798n * page); // Last 100 blocks
            const toBlock = latestBlock - (798n * (page - 1n));

            console.log(`Fetching logs from block ${fromBlock} to ${toBlock}...`);

            // Define job addresses (replace these with your actual job addresses)
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

            // Fetch logs
            const logs = await fetchWorkEvents(jobAddresses, fromBlock, toBlock);

        }


        /* if (logs.length === 0) {
            console.log('No logs found.');
        } else {
            console.log('Logs found:');
            logs.forEach((log, index) => {
                console.log(`Log ${index + 1}:`, log);
            });
        } */
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
