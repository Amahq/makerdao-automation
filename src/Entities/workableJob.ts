import { Address } from 'viem';

export type WorkableJob = {
  job: Address;
  canWork: boolean;
  args: string;
};
