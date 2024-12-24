import { AbiEvent, Address } from "viem";
import { client, jobAbi } from "../modules/config";


export async function getEvents(address: Address[], eventName: string, amountOfBlocks: bigint, eventAbi?: AbiEvent): Promise<unknown[]> {
    const currentBlock = await client.getBlockNumber();
    const targetBlock = currentBlock - amountOfBlocks;

    const logs = await client.getLogs({
        address: address,
        event: eventAbi,
        fromBlock: targetBlock,
        toBlock: 'latest',
    });

    return logs;
}