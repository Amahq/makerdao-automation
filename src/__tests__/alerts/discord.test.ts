require('dotenv').config();
import axios from 'axios';
import { sendDiscordAlert } from '../../alerts/discord';

// Mocking Axios for controlled responses in tests
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// Group of tests for Discord integration
describe('Discord Integration - sendDiscordAlert', () => {
  // Ensures a clean state for mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Validates successful alert delivery to Discord
  it('should send an alert to Discord with a valid message', async () => {
    // Simulates a successful response from the Discord API
    mockedAxios.post.mockResolvedValue({ status: 200 });

    // Calls the function with a test alert message
    const result = await sendDiscordAlert('Test Alert');

    // Ensures the correct response is returned
    expect(result).toEqual({ status: 200 });

    // Verifies that Axios was called with the right arguments
    expect(mockedAxios.post).toHaveBeenCalledWith(
      process.env.DISCORD_WEBHOOK_URL,
      { content: 'Test Alert' },
    );

    // Confirms the API was called exactly once
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  // Tests handling of network errors during API calls
  it('should handle errors in Discord integration', async () => {
    // Simulates a network error
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));

    // Expects the function to throw the same error
    await expect(sendDiscordAlert('Test Alert')).rejects.toThrow(
      'Network Error',
    );

    // Confirms the function attempted one API call
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  // Ensures no alert is sent if the input message is empty
  it('should not send an alert if the message is empty', async () => {
    // Expects an error for an empty message
    await expect(sendDiscordAlert('')).rejects.toThrow(
      'Message cannot be empty',
    );

    // Verifies that no API call was made
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  // Tests handling of HTTP error responses from Discord
  it('should handle HTTP error responses from Discord', async () => {
    // Simulates a 400 Bad Request response from the Discord API
    mockedAxios.post.mockResolvedValue({ status: 400, data: 'Bad Request' });

    // Calls the function and validates the response matches the simulated one
    const result = await sendDiscordAlert('Test Alert');
    expect(result).toEqual({ status: 400, data: 'Bad Request' });

    // Confirms the API was called
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  // Ensures proper handling of request timeouts
  it('should timeout if the request takes too long', async () => {
    // Simulates a timeout error
    mockedAxios.post.mockRejectedValue(new Error('timeout of 5000ms exceeded'));

    // Expects the function to throw a timeout error
    await expect(sendDiscordAlert('Test Alert')).rejects.toThrow(
      'timeout of 5000ms exceeded',
    );

    // Confirms the API was called once despite the timeout
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  // Handles unexpected or malformed responses from Discord
  it('should handle responses with missing or malformed data', async () => {
    // Simulates a response with an empty object
    mockedAxios.post.mockResolvedValue({});

    // Calls the function and verifies it returns the simulated response
    const result = await sendDiscordAlert('Test Alert');
    expect(result).toEqual({});

    // Confirms the API was called
    expect(mockedAxios.post).toHaveBeenCalled();
  });
});
