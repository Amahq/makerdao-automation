"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_1 = require("./alerts/discord");
const blockchain_1 = require("./blockchain");
async function main() {
    try {
        const numberOfJobs = await (0, blockchain_1.getNumJobs)();
        const jobs = await (0, blockchain_1.getJobs)(numberOfJobs);
        const jobEventsDetected = await (0, blockchain_1.detectJobExecutions)(jobs, 100n);
        let notificationMessage = '';
        let sendNotification = false;
        jobEventsDetected.forEach((job) => {
            if (job.amountOfWorkDone == 0) {
                sendNotification = true;
                notificationMessage += `\nThe job ${job.job} hasn't done any work on the last 100 blocks...\n`;
            }
        });
        if (sendNotification) {
            (0, discord_1.sendDiscordAlert)(notificationMessage);
        }
    }
    catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}
// Wrap in an async IIFE to avoid top-level await issues
(async () => {
    await main();
})();
