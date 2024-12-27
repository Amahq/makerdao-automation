import { Abi, Address } from 'viem';

export type contract = {
  address: Address;
  abi: Abi;
  functionName: string;
  args: unknown[];
};
