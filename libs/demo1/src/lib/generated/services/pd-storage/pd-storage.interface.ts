import { PdAllocationInfo } from "../../interfaces/pd-allocation-info.model";
import { PdStorage } from "../../interfaces/pd-storage.model";

export interface PdStorageSyncQtyParamsType {
    bid: string;
    brid: string;
    pdStorage: PdStorage;
    cascading?: boolean;
    persistOutside?: boolean;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdStorageAllocateParamsType {
    bid: string;
    brid: string;
    pdStorageId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdStorageDeallocateParamsType {
    bid: string;
    brid: string;
    pdStorageId: string;
    qty: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdStorageIncreaseParamsType {
    bid: string;
    brid: string;
    pdStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdStorageDecreaseParamsType {
    bid: string;
    brid: string;
    pdStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdStorageAdjustParamsType {
    bid: string;
    brid: string;
    pdStorageId: string;
    qty?: number;
    preloaded?: any;
    bubble?: boolean;
    sharedClient?: any;
}

export interface PdStorageTransferParamsType {
    bid: string;
    brid: string;
    srcPdStorageId: string;
    dstPdStorageId: string;
    qty?: number;
    preloaded?: any;
    sharedClient?: any;
}

export interface PdAvailableByBranchReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    branchId: string;
    branchNo: string;
    branchName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}

export interface PdAvailableByWhReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whId: string;
    whNo: string;
    whName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}

export interface PdAvailableByZoneReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whZoneId: string;
    whZoneNo: string;
    whZoneName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}

export interface PdAvailableByAisleReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whAisleId: string;
    whAisleNo: string;
    whAisleName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}

export interface PdAvailableByRackReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whRackId: string;
    whRackNo: string;
    whRackName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}

export interface PdAvailableByShelfReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whShelfId: string;
    whShelfNo: string;
    whShelfName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}
export interface PdAvailableByStorageReturnType {
    pdId: string;
    pdNo: string;
    pdName: string;
    whStorageId: string;
    whStorageNo: string;
    whStorageName: string;
    ohQty: number;
    allocatedQty: number;
    availQty: number;
}
export interface TransferToSuParamsType {
    bid: string;
    brid: string;
    srcWhStorageId?: string;
    dstWhSuId?: string;
    pdId: string;
    transferQty: number;
    sharedClient?: any;
}
