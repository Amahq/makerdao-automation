"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordAlert = sendDiscordAlert;
const axios_1 = __importDefault(require("axios")); // Import axios for making HTTP requests
const config_1 = require("../config"); // Import utility function to retrieve environment variables
/**
 * Sends a message to a Discord channel using a webhook URL.
 *
 * @param {string} message - The message to send to the Discord channel.
 * @throws Will throw an error if the message is empty.
 * @throws Will throw an error if the Discord webhook URL is not defined in the environment variables.
 * @returns {Promise<any>} - The result of the Axios POST request to the Discord API.
 */
async function sendDiscordAlert(message) {
    // Validate that the message is not empty
    if (!message) {
        throw new Error('Message cannot be empty');
    }
    // Retrieve the Discord webhook URL from environment variables
    const discordUrl = (0, config_1.getEnvs)().DISCORD_WEBHOOK_URL;
    // Validate that the Discord webhook URL is defined
    if (!discordUrl) {
        throw new Error('Discord webhook URL is not defined');
    }
    // Send the message to Discord via the webhook URL
    const result = await axios_1.default.post(discordUrl, {
        content: message, // The content of the message sent to the Discord channel
    });
    // Return the result of the Axios POST request
    return result;
}
