import { Abi, AbiEvent, Address } from "viem"


export type contractEvent = {
    address: Address,
    abi: AbiEvent,
    eventName: string,
    nomberOfBlocks: BigInt
}