"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDiscordAlert = sendDiscordAlert;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
async function sendDiscordAlert(message) {
    const discordUrl = (0, config_1.getEnvs)().DISCORD_WEBHOOK_URL;
    if (!discordUrl) {
        console.error('No Discord Webhook URL configured.');
        return;
    }
    await axios_1.default.post(discordUrl, {
        content: message,
    });
}
