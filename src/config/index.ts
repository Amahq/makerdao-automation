import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { envs } from './env';

export const client = createPublicClient({
  batch: {
    multicall: true,
    //wait: 0, // The maximum number of milliseconds to wait before sending a batch. - Default 0
    //batchSize: 512, // Check if the provider has limits and use this accordingly - Default 1_024
  },
  chain: mainnet,
  transport: http(
    'https://mainnet.infura.io/v3/4606cb2948614630a5adc14dc6031831',
  ),
});

export const getEnvs = () => {
  return envs;
};
