export interface WhHuMoveParamsType {
    bid: string;
    brid: string;
    whHuId: string;
    whId?: string;
    whStorageId?: string;
    sharedClient?: any;
}
export interface WhHuMoveToHuParamsType {
    bid: string;
    brid: string;
    srcWhHuId: string;
    dstWhHuId: string;
    sharedClient?: any;
}