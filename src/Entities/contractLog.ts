import { Address } from 'viem';

export type ContractLog = {
  address: Address;
  blockHash: string;
  blockNumber: BigInt;
  data: string;
  logindex: number;
  removed: boolean;
  topics: string[];
  transactionHash: string;
  transactionIndex: number;
};
