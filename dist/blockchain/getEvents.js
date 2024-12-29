"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
const config_1 = require("../config");
/**
 * Fetches logs from the blockchain for the specified addresses, block range, and event type.
 *
 * This function interacts with the blockchain client to retrieve logs emitted by the
 * specified contract addresses within a defined block range. Optionally, an event ABI
 * can be provided to filter logs for a specific event type.
 *
 * @param {Address[]} address - An array of contract addresses to fetch logs from.
 * @param {bigint} amountOfBlocks - The number of blocks to look back for logs.
 * @param {AbiEvent} [eventAbi] - (Optional) The ABI of the event to filter logs.
 * @returns {Promise<unknown[]>} - A promise resolving to an array of log objects.
 *
 * @throws {Error} If the client fails to fetch logs or the block number.
 *
 * @example
 * const logs = await getEvents(
 *   ['0x0000000000000000000000000000000000000001'],
 *   100n,
 *   myEventAbi,
 * );
 * console.log(logs); // Logs emitted by the specified address and event within the last 100 blocks
 */
async function getEvents(address, amountOfBlocks, eventAbi) {
    // Fetch the current block number from the blockchain
    const currentBlock = await config_1.client.getBlockNumber();
    // Calculate the starting block for the log query
    const targetBlock = currentBlock - amountOfBlocks;
    // Fetch logs matching the specified parameters
    const logs = await config_1.client.getLogs({
        address: address, // Contract addresses to fetch logs from
        event: eventAbi, // (Optional) ABI of the event to filter logs
        fromBlock: targetBlock, // Starting block of the range
        toBlock: 'latest', // Fetch logs up to the latest block
    });
    return logs; // Return the fetched logs
}
