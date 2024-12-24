import { Abi, Address } from 'viem';

export type Contract = {
  address: Address;
  abi: Abi;
  functionName: string;
  args: unknown[];
};
