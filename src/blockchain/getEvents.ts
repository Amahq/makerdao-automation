import { AbiEvent, Address } from 'viem';
import { client } from '../config';

export async function getEvents(
  address: Address[],
  amountOfBlocks: bigint,
  eventAbi?: AbiEvent,
): Promise<unknown[]> {
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
