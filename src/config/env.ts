/**
 * Configuration object for environment variables and constants used throughout the application.
 *
 * This module centralizes the retrieval and defaulting of environment variables. It ensures
 * that all required configurations are accessible and provides default values where necessary.
 *
 * @property {string} RPC_URL - The URL for the blockchain RPC endpoint. Defaults to an empty string if not provided.
 * @property {string} ETHERSCAN_API_KEY - The API key for accessing the Etherscan service. Defaults to an empty string if not provided.
 * @property {string} DISCORD_WEBHOOK_URL - The webhook URL for sending alerts to Discord. Defaults to an empty string if not provided.
 * @property {string} ETHERSCAN_API_URL - The base API URL for Etherscan services. Defaults to an empty string if not provided.
 * @property {string} ETHERSCAN_BASE_API_URL - An additional base API URL for Etherscan. Defaults to an empty string if not provided.
 * @property {string} SEQUENCER_ADDRESS - The address of the Sequencer contract. Defaults to an empty string if not provided.
 * @property {number} EXECUTION_INTERVAL - The interval for executing jobs in milliseconds. Defaults to `14000`.
 */
export const envs = {
  RPC_URL: process.env.RPC_URL || '', // Blockchain RPC endpoint
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || '', // Etherscan API key
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || '', // Discord webhook URL
  ETHERSCAN_API_URL: process.env.ETHERSCAN_API_URL || '', // Etherscan API URL
  ETHERSCAN_BASE_API_URL: process.env.ETHERSCAN_BASE_API_URL || '', // Base Etherscan API URL
  SEQUENCER_ADDRESS: process.env.SEQUENCER_ADDRESS || '', // Sequencer contract address
  EXECUTION_INVERTAL: 30000 as number, // Execution interval in milliseconds
};
