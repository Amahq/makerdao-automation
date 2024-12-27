import axios from 'axios';
import { sendDiscordAlert } from '../../alerts/discord';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

describe('Discord Integration', () => {
  it('should send an alert to Discord', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200 });
    const result = await sendDiscordAlert('Test Alert');
    expect(result).toEqual({ status: 200 });
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it('should handle errors in Discord integration', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Network Error'));
    await expect(sendDiscordAlert('Test Alert')).rejects.toThrow(
      'Network Error',
    );
  });
});
