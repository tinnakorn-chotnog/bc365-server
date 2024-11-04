import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";
import { PdBranch } from "../../interfaces/pd-branch.model";

export interface PdBranchSyncQtyParamsType {
    bid: string;
    brid: string;
    pdBranch: PdBranch;
    cascading?: boolean;
    persistOutside?: boolean;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdBranchAllocateParamsType {
    bid: string;
    brid: string;
    pdBranchId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdBranchDeallocateParamsType {
    bid: string;
    brid: string;
    pdBranchId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdBranchIncreaseParamsType {
    bid: string;
    brid: string;
    pdBranchId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdBranchDecreaseParamsType {
    bid: string;
    brid: string;
    pdBranchId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}
