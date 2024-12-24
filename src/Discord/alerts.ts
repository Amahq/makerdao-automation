import axios from 'axios';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';

export async function sendDiscordAlert(message: string) {
    if (!DISCORD_WEBHOOK) {
        console.error('No Discord Webhook URL configured.');
        return;
    }
    await axios.post(DISCORD_WEBHOOK, {
        content: message,
    });
}
