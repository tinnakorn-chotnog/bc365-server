import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";

export interface PdLotStorageAllocateParamsType {
    bid: string;
    brid: string;
    pdLotStorageId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdLotStorageDeallocateParamsType {
    bid: string;
    brid: string;
    pdLotStorageId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdLotStorageIncreaseParamsType {
    bid: string;
    brid: string;
    pdLotStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdLotStorageDecreaseParamsType {
    bid: string;
    brid: string;
    pdLotStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdLotStorageAdjustParamsType {
    bid: string;
    brid: string;
    pdLotStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdLotStorageMergeParamsType {
    bid: string;
    brid: string;
    srcPdLotStorageId: string;
    dstPdLotStorageId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}
export interface PdLotStorageTransferParamsType {
    bid: string;
    brid: string;
    srcPdLotStorageId: string;
    dstPdStorageId?: string;
    dstPdLotStorageId?: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}