import { getEvents } from '../../blockchain/getEvents';
import { Address } from 'viem';

jest.mock('../../config', () => ({
  client: {
    getBlockNumber: jest.fn(() => Promise.resolve(1000n)), // Mock block number
    getLogs: jest.fn(() =>
      Promise.resolve([
        {
          address: '0x0000000000000000000000000000000000000001',
          data: 'WorkEvent1',
        },
        {
          address: '0x0000000000000000000000000000000000000002',
          data: 'WorkEvent2',
        },
      ]),
    ), // Mock logs
  },
}));

const mockedClient = require('../../config').client;

describe('getEvents', () => {
  it('should fetch logs for the given address and block range', async () => {
    const address: Address[] = [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
    ];
    const amountOfBlocks = 100n;

    const logs = await getEvents(address, amountOfBlocks);

    expect(logs).toEqual([
      {
        address: '0x0000000000000000000000000000000000000001',
        data: 'WorkEvent1',
      },
      {
        address: '0x0000000000000000000000000000000000000002',
        data: 'WorkEvent2',
      },
    ]);

    expect(mockedClient.getBlockNumber).toHaveBeenCalledTimes(1);
    expect(mockedClient.getLogs).toHaveBeenCalledWith({
      address,
      event: undefined,
      fromBlock: 900n, // 1000 - 100
      toBlock: 'latest',
    });
  });

  it('should return an empty array if no logs are found', async () => {
    mockedClient.getLogs.mockResolvedValueOnce([]); // Mock no logs

    const address: Address[] = ['0x0000000000000000000000000000000000000001'];
    const amountOfBlocks = 100n;

    const logs = await getEvents(address, amountOfBlocks);

    expect(logs).toEqual([]);
  });
});
