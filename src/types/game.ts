import {BigNumber} from "ethers";

export enum WorldStatusType {
    EXISTING,
    NOT_FOUND,
    EMPTY,
}

export type WorldType = {
    createdTime: BigNumber,
    creator: string,
    lastUpdateTime: BigNumber,
    state: string,
    id: string,
    title: string
}