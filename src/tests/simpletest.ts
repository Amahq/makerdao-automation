import { AbiEvent, Address } from "viem";
import { client, jobAbi, RPC_URL, sequencerAbi, sequencerAddress } from "../modules/config";
import { fetchAllWorkEvents } from "../modules/jobs";
import { getMasterNetwork, listNetworks } from "../modules/sequencer";
import * as dotenv from 'dotenv';
import { getBlockNumber } from "viem/_types/actions/public/getBlockNumber";
import { decodeEventLog } from 'viem';

async function main() {
    dotenv.config();
    const currentBlock = await client.getBlockNumber();
    const targetBlock = currentBlock - 2000n;

    const eventAbi = {
            type: "event",
            inputs: [
                { indexed: true, name: 'network', type: 'bytes32' },
                { indexed: true, name: 'ilk', type: 'bytes32' },
            ],
            name: 'Work',
    }  as AbiEvent;

    console.log("start getting the events...");

    const logs = await client.getLogs({
        address: '0x67AD4000e73579B9725eE3A149F85C4Af0A61361',
        event: eventAbi,
        fromBlock: targetBlock,
        toBlock: 'latest',
    });

    console.log("after getting the events...");
    console.log(logs);
}



main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});