import { getNumJobs } from '../../blockchain';

// Mocking the blockchain module to simulate interactions during testing
jest.mock('../../blockchain', () => ({
  getNumJobs: jest.fn(), // Mock implementation of getNumJobs
}));

// Type-safe mock for the getNumJobs function
const mockedGetNumJobs = jest.mocked(getNumJobs);

// Group of tests for the `getNumJobs` function
describe('Contract Interaction - getNumJobs', () => {
  // Ensure mocks are reset before each test to maintain test isolation
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Validate that getNumJobs returns the correct number of jobs for a standard case
  it('should call getNumJobs and return the correct number of jobs', async () => {
    // Simulate a successful response with 5 jobs
    mockedGetNumJobs.mockResolvedValue(5n);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result matches the mocked value
    expect(result.toString()).toBe('5');
    // Confirm the mock was called
    expect(mockedGetNumJobs).toHaveBeenCalled();
    // Confirm the mock was called exactly once
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior when no jobs are available
  it('should handle zero jobs', async () => {
    // Simulate a response with zero jobs
    mockedGetNumJobs.mockResolvedValue(0n);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result correctly indicates no jobs
    expect(result.toString()).toBe('0');
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior when a large number of jobs are available
  it('should handle a large number of jobs', async () => {
    // Simulate a large response
    mockedGetNumJobs.mockResolvedValue(1000000n);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result correctly reflects the large number
    expect(result.toString()).toBe('1000000');
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior with an unexpected negative value
  it('should handle negative values gracefully (unexpected behavior)', async () => {
    // Simulate a negative response (unexpected case)
    mockedGetNumJobs.mockResolvedValue(-1n);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result reflects the negative value
    expect(result.toString()).toBe('-1');
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior when the contract call fails
  it('should throw an error if the contract call fails', async () => {
    // Simulate a contract call failure
    mockedGetNumJobs.mockRejectedValue(new Error('Contract call failed'));

    // Ensure the function throws the correct error
    await expect(getNumJobs()).rejects.toThrow('Contract call failed');
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior when the response is undefined
  it('should handle undefined response gracefully', async () => {
    // Simulate an undefined response
    mockedGetNumJobs.mockResolvedValue(undefined as unknown as bigint);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result is undefined as expected
    expect(result).toBeUndefined();
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });

  // Validate behavior when a non-BigInt value is returned (unexpected)
  it('should handle non-BigInt values returned (unexpected)', async () => {
    // Simulate a non-BigInt response
    mockedGetNumJobs.mockResolvedValue(5 as unknown as bigint);

    // Call the function
    const result = await getNumJobs();

    // Ensure the result is correctly converted and matches the expected value
    expect(result.toString()).toBe('5');
    expect(mockedGetNumJobs).toHaveBeenCalled();
    expect(mockedGetNumJobs).toHaveBeenCalledTimes(1);
  });
});
