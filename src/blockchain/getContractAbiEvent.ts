import axios from 'axios';
import { AbiEvent } from 'viem';
import { getEnvs } from '../config';

// Function to fetch contract source code
export async function getContractAbi(
  address: string,
  type: string,
  name: string,
): Promise<AbiEvent> {
  let returnedValue;
  try {
    // Etherscan API URL
    const url = getEnvs().ETHERSCAN_BASE_API_URL;

    // Make the API request
    const response = await axios.get(url, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: getEnvs().ETHERSCAN_API_KEY,
      },
    });

    // Parse and format the JSON response
    const data = response.data;

    //console.log(response.data.result[0].ABI)
    if (data.status === '1') {
      const abi = JSON.parse(response.data.result[0].ABI) as AbiEvent[];
      abi.forEach((element) => {
        if (element.type == type && element.name == name) {
          returnedValue = element;
        }
      });
      return returnedValue as unknown as AbiEvent;
    } else {
      console.error('Error from API:', data.message);
    }
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
  return returnedValue as unknown as AbiEvent;
}
