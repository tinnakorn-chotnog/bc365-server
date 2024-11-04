import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";
import { PdHu } from "../../interfaces/pd-hu.model";

export interface PdHuSyncQtyParamsType {
    bid: string;
    brid: string;
    pdHu: PdHu;
    cascading?: boolean;
    persistOutside?: boolean;
    preloaded?: any;
    sharedClient?: any;
}
export interface PdHuAllocateParamsType {
    bid: string;
    brid: string;
    pdHuId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdHuDeallocateParamsType {
    bid: string;
    brid: string;
    pdHuId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdHuIncreaseParamsType {
    bid: string;
    brid: string;
    pdHuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdHuDecreaseParamsType {
    bid: string;
    brid: string;
    pdHuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdHuAdjustParamsType {
    bid: string;
    brid: string;
    pdHuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdHuMergeParamsType {
    bid: string;
    brid: string;
    srcPdHuId: string;
    dstPdHuId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}
export interface PdHuTransferParamsType {
    bid: string;
    brid: string;
    srcPdHuId: string;
    dstPdStorageId?: string;
    dstPdHuId?: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}