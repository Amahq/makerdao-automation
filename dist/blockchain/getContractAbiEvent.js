"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractAbi = getContractAbi;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
// Function to fetch contract source code
async function getContractAbi(address, type, name) {
    let returnedValue;
    try {
        // Etherscan API URL
        const url = (0, config_1.getEnvs)().ETHERSCAN_BASE_API_URL;
        // Make the API request
        const response = await axios_1.default.get(url, {
            params: {
                module: 'contract',
                action: 'getsourcecode',
                address: address,
                apikey: (0, config_1.getEnvs)().ETHERSCAN_API_KEY,
            },
        });
        // Parse and format the JSON response
        const data = response.data;
        //console.log(response.data.result[0].ABI)
        if (data.status === '1') {
            const abi = JSON.parse(response.data.result[0].ABI);
            abi.forEach((element) => {
                if (element.type == type && element.name == name) {
                    returnedValue = element;
                }
            });
            return returnedValue;
        }
        else {
            console.error('Error from API:', data.message);
        }
    }
    catch (error) {
        console.error('Error fetching data from API:', error);
    }
    return returnedValue;
}
