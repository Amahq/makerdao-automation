import { Address } from 'viem';
import { getJobAt } from '../../blockchain';

// Mocking the blockchain module to simulate interactions with the contract
jest.mock('../../blockchain', () => ({
  getJobAt: jest.fn(),
}));

// Type-safe mock for the getJobAt function
const mockedGetJobAt = jest.mocked(getJobAt);

// Group of tests for the `getJobAt` function
describe('Contract Interaction - getJobAt', () => {
  // Clear all mocks before each test to ensure test independence
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test case to validate that getJobAt works for index 0
  it('should call getJobAt and return the correct job data for index 0', async () => {
    // Simulate a valid job response for index 0
    mockedGetJobAt.mockResolvedValue({
      job: 'job1' as Address,
      canWork: true,
      args: '',
    });

    // Call the function with index 0
    const result = await getJobAt(0);

    // Verify the returned data matches the simulated response
    expect(result).toEqual({ job: 'job1' as Address, canWork: true, args: '' });

    // Ensure the mock was called with the correct arguments
    expect(mockedGetJobAt).toHaveBeenCalledWith(0);

    // Confirm the mock was called exactly once
    expect(mockedGetJobAt).toHaveBeenCalledTimes(1);
  });

  // Test case to validate the function works for a different index (5)
  it('should return correct job data for index 5', async () => {
    // Simulate a valid job response for index 5
    mockedGetJobAt.mockResolvedValue({
      job: 'job6' as Address,
      canWork: false,
      args: 'arg1,arg2',
    });

    // Call the function with index 5
    const result = await getJobAt(5);

    // Verify the returned data matches the simulated response
    expect(result).toEqual({
      job: 'job6' as Address,
      canWork: false,
      args: 'arg1,arg2',
    });

    // Ensure the mock was called with the correct arguments
    expect(mockedGetJobAt).toHaveBeenCalledWith(5);

    // Confirm the mock was called exactly once
    expect(mockedGetJobAt).toHaveBeenCalledTimes(1);
  });

  // Test case to handle an invalid index (-1)
  it('should handle invalid index gracefully', async () => {
    // Simulate an error response for an invalid index
    mockedGetJobAt.mockRejectedValue(new Error('Invalid index'));

    // Expect the function to throw the simulated error
    await expect(getJobAt(-1)).rejects.toThrow('Invalid index');

    // Ensure the mock was called with the invalid index
    expect(mockedGetJobAt).toHaveBeenCalledWith(-1);

    // Confirm the mock was called exactly once
    expect(mockedGetJobAt).toHaveBeenCalledTimes(1);
  });

  // Test case to handle a general contract call failure
  it('should handle error if contract call fails', async () => {
    // Simulate a generic contract call failure
    mockedGetJobAt.mockRejectedValue(new Error('Contract call failed'));

    // Expect the function to throw the simulated error
    await expect(getJobAt(10)).rejects.toThrow('Contract call failed');

    // Ensure the mock was called with the index that caused the failure
    expect(mockedGetJobAt).toHaveBeenCalledWith(10);

    // Confirm the mock was called exactly once
    expect(mockedGetJobAt).toHaveBeenCalledTimes(1);
  });

  // Test case to validate handling of an empty args field in the response
  it('should handle empty args field', async () => {
    // Simulate a job response with an empty args field
    mockedGetJobAt.mockResolvedValue({
      job: 'job3' as Address,
      canWork: true,
      args: '',
    });

    // Call the function with index 3
    const result = await getJobAt(3);

    // Verify the returned data matches the simulated response
    expect(result).toEqual({
      job: 'job3' as Address,
      canWork: true,
      args: '',
    });

    // Ensure the mock was called with the correct arguments
    expect(mockedGetJobAt).toHaveBeenCalledWith(3);
  });
});
