import axios from 'axios'; // Import axios for making HTTP requests
import { getEnvs } from '../config'; // Import utility function to retrieve environment variables

/**
 * Sends a message to a Discord channel using a webhook URL.
 *
 * @param {string} message - The message to send to the Discord channel.
 * @throws Will throw an error if the message is empty.
 * @throws Will throw an error if the Discord webhook URL is not defined in the environment variables.
 * @returns {Promise<any>} - The result of the Axios POST request to the Discord API.
 */
export async function sendDiscordAlert(message: string) {
  // Validate that the message is not empty
  if (!message) {
    throw new Error('Message cannot be empty');
  }

  // Retrieve the Discord webhook URL from environment variables
  const discordUrl = getEnvs().DISCORD_WEBHOOK_URL;

  // Validate that the Discord webhook URL is defined
  if (!discordUrl) {
    throw new Error('Discord webhook URL is not defined');
  }

  // Send the message to Discord via the webhook URL
  const result = await axios.post(discordUrl, {
    content: message, // The content of the message sent to the Discord channel
  });

  // Return the result of the Axios POST request
  return result;
}
