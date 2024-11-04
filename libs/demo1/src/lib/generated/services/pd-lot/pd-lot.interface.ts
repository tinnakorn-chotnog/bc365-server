import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";

export interface PdLotAllocateParamsType {
    bid: string;
    brid: string;
    pdLotId: string;
    qty: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdLotDeallocateParamsType {
    bid: string;
    brid: string;
    pdLotId: string;
    qty: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdLotIncreaseParamsType {
    bid: string;
    brid: string;
    pdLotId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdLotDecreaseParamsType {
    bid: string;
    brid: string;
    pdLotId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}