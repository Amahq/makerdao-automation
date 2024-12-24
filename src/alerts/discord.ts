import axios from 'axios';
import { getEnvs } from '../config';

export async function sendDiscordAlert(message: string) {
  const discordUrl = getEnvs().DISCORD_WEBHOOK_URL;
  if (!discordUrl) {
    console.error('No Discord Webhook URL configured.');
    return;
  }

  await axios.post(discordUrl, {
    content: message,
  });
}
