import { Pd } from "../../interfaces/pd.model";

export interface PdSyncQtyParamsType {
    bid: string;
    brid: string;
    pd: Pd;
    cascading: boolean;
    persistOutside: boolean;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdAllocateParamsType {
    bid: string;
    brid: string;
    pdId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdDeallocateParamsType {
    bid: string;
    brid: string;
    pdId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdIncreaseParamsType {
    bid: string;
    brid: string;
    pdId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdDecreaseParamsType {
    bid: string;
    brid: string;
    pdId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}