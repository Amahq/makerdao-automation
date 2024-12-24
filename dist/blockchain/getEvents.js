"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
const config_1 = require("../config");
async function getEvents(address, amountOfBlocks, eventAbi) {
    const currentBlock = await config_1.client.getBlockNumber();
    const targetBlock = currentBlock - amountOfBlocks;
    const logs = await config_1.client.getLogs({
        address: address,
        event: eventAbi,
        fromBlock: targetBlock,
        toBlock: 'latest',
    });
    return logs;
}
