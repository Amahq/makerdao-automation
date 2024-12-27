import { Address } from 'viem';

export type contractLog = {
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
