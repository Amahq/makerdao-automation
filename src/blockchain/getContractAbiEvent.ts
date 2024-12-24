import axios from "axios";
import { etherscan_apikey } from "../modules/config";
import * as dotenv from 'dotenv';
import { AbiEvent, AbiEventNotFoundError } from "viem";

// Function to fetch contract source code
export async function getContractAbi(address: string, type: string, name: string): Promise<AbiEvent> {
    var returnedValue
    try {
    dotenv.config();
    // Etherscan API URL
    const url = `https://api.etherscan.io/api`;

    // Make the API request
    const response = await axios.get(url, {
      params: {
        module: "contract",
        action: "getsourcecode",
        address: address,
        apikey: process.env.ETHERSCAN_API_KEY,
      },
    });

    // Parse and format the JSON response
    const data = response.data;
    

    //console.log(response.data.result[0].ABI)
    if (data.status === "1") {

        const abi = JSON.parse(response.data.result[0].ABI) as AbiEvent[];
      abi.forEach((element ) => {
        if(element.type == type && element.name == name){
            returnedValue = element
        }
      });
      return returnedValue as unknown as AbiEvent;
    } else {
      console.error("Error from API:", data.message);
    }

  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
  return returnedValue as unknown as AbiEvent;
}

