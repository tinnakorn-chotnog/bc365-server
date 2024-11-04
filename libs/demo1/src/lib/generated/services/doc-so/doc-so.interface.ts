import { InventoryExceptionInfo } from "../../interfaces/inventory-exception-info.model";

export interface AccumSoPdReturnType {
    pdId: string;
    orderedQty?: number;
    availableQty?: number;
    backlogQty?: number;
    docSoItems?: AccumSoItemType[];
    exception?: InventoryExceptionInfo;
}

export interface AccumSoItemType {
    docSoId: string;
    itemIdx: number;
    itemId: string;
    orderedQty: number;
}