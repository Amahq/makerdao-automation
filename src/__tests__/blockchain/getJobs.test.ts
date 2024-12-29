import { getJobs } from '../../blockchain/getJobs';
import { client, getEnvs } from '../../config';
import { Address } from 'viem';

jest.mock('../../config', () => ({
  client: {
    multicall: jest.fn(),
  },
  getEnvs: jest.fn(() => ({
    SEQUENCER_ADDRESS: '0x0000000000000000000000000000000000000001',
  })),
}));

const mockedClient = require('../../config').client;
const mockedGetEnvs = require('../../config').getEnvs;

describe('getJobs', () => {
  /**
   * Clear mocks before each test to ensure clean state.
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test case to verify that getJobs fetches the correct job addresses.
   */
  it('should fetch job addresses correctly', async () => {
    const mockJobs: Address[] = [
      '0x0000000000000000000000000000000000000002',
      '0x0000000000000000000000000000000000000003',
      '0x0000000000000000000000000000000000000004',
    ];

    mockedClient.multicall.mockResolvedValueOnce(mockJobs);

    const amountOfJobs = 3n;
    const result = await getJobs(amountOfJobs);

    expect(result).toEqual(mockJobs); // Ensure the result matches the mocked data
    expect(mockedClient.multicall).toHaveBeenCalledTimes(1); // Ensure multicall is invoked once
    expect(mockedClient.multicall).toHaveBeenCalledWith({
      contracts: [
        {
          address: '0x0000000000000000000000000000000000000001',
          abi: expect.any(Object), // Expect ABI to be provided
          functionName: 'jobAt',
          args: [0],
        },
        {
          address: '0x0000000000000000000000000000000000000001',
          abi: expect.any(Object),
          functionName: 'jobAt',
          args: [1],
        },
        {
          address: '0x0000000000000000000000000000000000000001',
          abi: expect.any(Object),
          functionName: 'jobAt',
          args: [2],
        },
      ],
      allowFailure: false,
    });
  });

  /**
   * Test case to verify that getJobs throws an error when multicall fails.
   */
  it('should throw an error if multicall fails', async () => {
    mockedClient.multicall.mockRejectedValueOnce(new Error('Multicall failed'));

    const amountOfJobs = 2n;

    await expect(getJobs(amountOfJobs)).rejects.toThrow(
      'Error fetching job at index 0',
    );

    expect(mockedClient.multicall).toHaveBeenCalledTimes(1);
  });

  /**
   * Test case to verify that getJobs handles zero jobs gracefully.
   */
  it('should handle zero jobs gracefully', async () => {
    const mockJobs: Address[] = [];
    mockedClient.multicall.mockResolvedValueOnce(mockJobs);

    const amountOfJobs = 0n;
    const result = await getJobs(amountOfJobs);

    expect(result).toEqual([]); // Expect an empty array
    expect(mockedClient.multicall).toHaveBeenCalledTimes(1);
    expect(mockedClient.multicall).toHaveBeenCalledWith({
      contracts: [],
      allowFailure: false,
    });
  });
});
