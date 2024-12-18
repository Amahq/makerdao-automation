import { Address } from "viem"


export type workableJob = {
    job: Address,
    canWork: boolean,
    args: string
}