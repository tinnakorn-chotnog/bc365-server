import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";
import { PdSu } from "../../interfaces/pd-su.model";
import { Pd } from "../../interfaces/pd.model";

export interface PdSuSyncQtyParamsType {
    bid: string;
    brid: string;
    pdSu: PdSu;
    cascading?: boolean;
    persistOutside?: boolean;
    preloaded?: any;
    sharedClient?: any;
}
export interface PdSuAllocateParamsType {
    bid: string;
    brid: string;
    pdSuId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdSuDeallocateParamsType {
    bid: string;
    brid: string;
    pdSuId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdSuIncreaseParamsType {
    bid: string;
    brid: string;
    pdSuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdSuDecreaseParamsType {
    bid: string;
    brid: string;
    pdSuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    bubbleLot?: boolean;
    sharedClient?: any;
}

export interface PdSuAdjustParamsType {
    bid: string;
    brid: string;
    pdSuId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdSuMergeParamsType {
    bid: string;
    brid: string;
    srcPdSuId: string;
    dstPdSuId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}
export interface PdSuTransferParamsType {
    bid: string;
    brid: string;
    srcPdSuId?: string;
    srcPdSu?: PdSu;
    srcPdSuArray?: PdSu[];
    dstPdSuId?: string;
    dstWhSuId?: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}
export interface PdSuTransferToStorageParamsType {
    bid: string;
    brid: string;
    srcPdSuArray?: PdSu[];
    srcPdSu?: PdSu;
    srcWhSuId?: string;
    dstWhStorageId: string;
    pdId?: string;
    pdLotId?: string;
    transferQty?: number;
    sharedClient?: any;
}
export interface PdSuDumpToSuParamsType {
    bid: string;
    brid: string;
    srcWhSuId: string;
    dstWhSuId: string;
    sharedClient?: any;
}
export interface PdSuEmptySuParamsType {
    bid: string;
    brid: string;
    whSuId: string;
    sharedClient?: any;
}
export interface PdSuDumpToStorageParamsType {
    bid: string;
    brid: string;
    srcWhSuId: string;
    dstWhStorageId: string;
    sharedClient?: any;
}
export interface PdSuTransferToWhParamsType {
    bid: string;
    brid: string;
    srcPdSuArray?: PdSu[];
    srcPdSu?: PdSu;
    srcWhSuId?: string;
    dstWhId: string;
    pdId?: string;
    pdLotId?: string;
    sharedClient?: any;
}
export interface PdSuMiniReturnType {
    pdSuId: string;
    lastQty: number;
    newQty: number;
    refPdNo?: string;
    refPdName?: string;
    refStorageNo?: string;
    refLotNo?: string;
    refSuNo?: string;
    refHuNo?: string;
}