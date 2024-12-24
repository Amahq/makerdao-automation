import { AbiEvent, Address } from 'viem';

export type ContractEvent = {
  address: Address;
  abi: AbiEvent;
  eventName: string;
  nomberOfBlocks: BigInt;
};
