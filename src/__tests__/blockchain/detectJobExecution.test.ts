import { detectJobExecutions } from '../../blockchain';
import { Address } from 'viem';
import { contractLog } from '../../entities';

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
          address: '0x0000000000000000000000000000000000000001',
          data: 'WorkEvent2',
        },
        {
          address: '0x0000000000000000000000000000000000000002',
          data: 'WorkEvent3',
        },
      ]),
    ), // Mock logs
  },
}));

const mockedClient = require('../../config').client;

describe('detectJobExecutions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedClient.getBlockNumber.mockClear();
    mockedClient.getLogs.mockClear();
  });

  it('should correctly aggregate job executions based on logs', async () => {
    const jobs: Address[] = [
      '0x0000000000000000000000000000000000000001',
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
    ];
    const blocksToCheck = 100n;

    const result = await detectJobExecutions(jobs, blocksToCheck);

    expect(result).toEqual([
      {
        job: '0x0000000000000000000000000000000000000001',
        amountOfWorkDone: 2,
      },
      {
        job: '0x0000000000000000000000000000000000000002',
        amountOfWorkDone: 1,
      },
      {
        job: '0x0000000000000000000000000000000000000003',
        amountOfWorkDone: 0,
      },
    ]);

    expect(mockedClient.getBlockNumber).toHaveBeenCalledTimes(1);
    expect(mockedClient.getLogs).toHaveBeenCalledWith({
      address: jobs,
      event: undefined,
      fromBlock: 900n, // 1000 - 100
      toBlock: 'latest',
    });
  });

  it('should log an error when processing invalid logs', async () => {
    mockedClient.getLogs.mockResolvedValueOnce([
      {
        address: '0xInvalidAddress' as Address,
        data: 'WorkEvent',
      } as contractLog,
      { address: undefined } as unknown as contractLog, // Missing address
    ]);

    const jobs: Address[] = ['0x0000000000000000000000000000000000000001'];
    const blocksToCheck = 100n;

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await detectJobExecutions(jobs, blocksToCheck);

    expect(result).toEqual([
      {
        job: '0x0000000000000000000000000000000000000001',
        amountOfWorkDone: 0,
      },
    ]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error while processing job logs:',
      expect.anything(),
    );

    consoleErrorSpy.mockRestore();
  });
});
