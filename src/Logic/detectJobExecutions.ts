import { Address } from "viem";
import { getEvents } from "../blockchain/getEvents";
import { contractEvent } from "../Entities/contractEvent";
import { contractLog } from "../Entities/contractLog";
import { decodeFromBytes32 } from "../modules/utils";
import { TokenIsEthError } from "viem/_types/zksync/errors/token-is-eth";

export async function detectJobExecutions(jobs: Address[], blocksToCheck: bigint): Promise<number> {

    const logs =  await getEvents(jobs, "Work", blocksToCheck) as contractLog[]; //The job executions are obtained by getting all the logs of the "Work" events found in the jobs addresses.

    /* logs.forEach((element: string) => {
      const abi = JSON.parse(element as string);
      abi.forEach((el: any ) => {
        
       console.log(el);
      });
    }) */
   console.log(logs[0])
   console.log(decodeFromBytes32(logs[0].data));
   console.log(logs[0].topics)
   logs[0].topics.forEach((topic)=> {
    console.log(decodeFromBytes32(topic));
   })
    
    //console.log(logs);

    return logs.length;
}
