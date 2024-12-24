import axios from 'axios';

export async function sendDiscordAlert(message: string) {
    console.log(process.env.DISCORD_WEBHOOK_URL)
    if (!process.env.DISCORD_WEBHOOK_URL) {
        console.error('No Discord Webhook URL configured.');
        return;
    }
    
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        content: message,
    });
}
