import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";
import { PdWh } from "../../interfaces/pd-wh.model";

export interface PdWhSyncQtyParamsType {
    bid: string;
    brid: string;
    pdWh: PdWh;
    cascading?: boolean;
    persistOutside?: boolean;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdWhAllocateParamsType {
    bid: string;
    brid: string;
    pdWhId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdWhDeallocateParamsType {
    bid: string;
    brid: string;
    pdWhId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdWhIncreaseParamsType {
    bid: string;
    brid: string;
    pdWhId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdWhDecreaseParamsType {
    bid: string;
    brid: string;
    pdWhId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}