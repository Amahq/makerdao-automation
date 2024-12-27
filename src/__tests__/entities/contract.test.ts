import { Address } from 'viem';
import { getNumJobs, getJobAt } from '../../blockchain';

jest.mock('../../blockchain', () => ({
  getNumJobs: jest.fn(),
  getJobAt: jest.fn(),
}));

const mockedGetNumJobs = jest.mocked(getNumJobs);
const mockedGetJobAt = jest.mocked(getJobAt);

describe('Contract Interaction', () => {
  it('should call getNumJobs and return the number of jobs', async () => {
    mockedGetNumJobs.mockResolvedValue(5n);
    const result = await getNumJobs();
    expect(result).toBe(5);
    expect(mockedGetNumJobs).toHaveBeenCalled();
  });

  it('should call getJobAt and return the correct job data', async () => {
    mockedGetJobAt.mockResolvedValue({
      job: 'job1' as Address,
      canWork: true,
      args: '',
    });
    const result = await getJobAt(0);
    expect(result).toEqual({ id: 'job1', workable: true });
    expect(mockedGetJobAt).toHaveBeenCalledWith(0);
  });
});
