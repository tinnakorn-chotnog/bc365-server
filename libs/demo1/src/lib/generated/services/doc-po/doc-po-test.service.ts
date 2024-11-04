import { ModuleRef } from "@nestjs/core";
import { DocPoExtService } from "./doc-po-ext.service";
import { PdSuppExtService } from "../pd-supp";
import { groupBy, keyBy } from "lodash";
import { SuppExtService } from "../supp";
import { DocPo } from "../../interfaces/doc-po.model";
import shortUUID from "short-uuid";
import { PdSupp } from "../../interfaces/pd-supp.model";
import { PdPurchaseInfo } from "../../interfaces/pd-purchase-info.model";
import { PdUomExtService } from "../pd-uom";
import { PdUom } from "../../interfaces/pd-uom.model";

export class DocPoTestService extends DocPoExtService {

    get suppServices() {
        return this.modRef.get<SuppExtService>(SuppExtService)
    }

    get pdSuppServices() {
        return this.modRef.get<PdSuppExtService>(PdSuppExtService)
    }

    get pdUomServices() {
        return this.modRef.get<PdUomExtService>(PdUomExtService)
    }

    createTestPo(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdSupps = await this.pdSuppServices.get({ bid, brid })
                const pdSuppMap = groupBy(pdSupps, 'suppId');
                const supps = await this.suppServices.get({ bid, brid });
                const pdUoms = await this.pdUomServices.get({ bid, brid });
                const pdUomMap = keyBy(pdUoms, 'pdUomId')
                const docPos: DocPo[] = [];
                let i = 1;
                supps.slice(0, 100).forEach( supp => {
                    const pdSupp: PdSupp = pdSuppMap[supp.suppId][0];
                    const pdUom: PdUom = pdUomMap[pdSupp.pdUomId]
                    const oitem: PdPurchaseInfo = {
                        itemId: shortUUID.generate(),
                        pdId: pdSupp.pdId,
                        pdSuppId: pdSupp.pdSuppId,
                        orderedQty: pdSupp.minOrder,
                        pdUomId: pdSupp.pdUomId,
                        unitPrice: pdSupp.unitPrice,
                        totalPrice: pdSupp.unitPrice * pdSupp.minOrder,
                        applySu: false,
                        suTypeId: null,
                        qtyPerSu: null,
                        numOfSu: null,
                        deliveredQty: 0,
                        invoicedQty: 0,
                        returnedQty: 0,
                        status: 'R',
                        allowPartialShipment: false,
                        cnvFactor: pdUom.cnvFactor,
                        baseUnitOrderedQty: pdSupp.minOrder * pdUom.cnvFactor
                    }
                    const o: DocPo = {
                        docPoId: shortUUID.generate(),
                        docNo: `PO${i.toString().padStart(4, '0')}`,
                        docDate: new Date().getTime(),
                        whId: 'dRF8jGphpQxRiCuuSNVybc',
                        suppId: supp.suppId,
                        refSuppName: supp.suppName,
                        taxRate: 7,
                        taxAmt: oitem.totalPrice * 7 / 100,
                        totalAmt: oitem.totalPrice + (oitem.totalPrice * 7 / 100),
                        status: 'R',
                        items: [oitem]
                    }
                    docPos.push(o)
                    i++
                })
                await this.addList({bid, brid, batch: true, data: docPos})
                await this.flush();
                resolve('OK')
            } catch(e) {
                reject(e)
            }
        })
    }

    createTestPoWithSu(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdSupps = await this.pdSuppServices.get({ bid, brid })
                const pdSuppMap = groupBy(pdSupps, 'suppId');
                const supps = await this.suppServices.get({ bid, brid });
                const pdUoms = await this.pdUomServices.get({ bid, brid });
                const pdUomMap = keyBy(pdUoms, 'pdUomId')
                const docPos: DocPo[] = [];
                let i = 1;
                supps.slice(0, 100).forEach( supp => {
                    const pdSupp: PdSupp = pdSuppMap[supp.suppId][0];
                    const pdUom: PdUom = pdUomMap[pdSupp.pdUomId]
                    const numOfSu = 20;
                    const qtyPerSu = pdSupp.qtyPerSu;
                    const orderedQty = numOfSu * qtyPerSu;
                    const oitem: PdPurchaseInfo = {
                        itemId: shortUUID.generate(),
                        pdId: pdSupp.pdId,
                        pdSuppId: pdSupp.pdSuppId,
                        orderedQty: orderedQty,
                        pdUomId: pdSupp.pdUomId,
                        unitPrice: pdSupp.unitPrice,
                        totalPrice: pdSupp.unitPrice * pdSupp.minOrder,
                        applySu: true,
                        suTypeId: pdSupp.suTypeId,
                        qtyPerSu: pdSupp.qtyPerSu,
                        numOfSu: numOfSu,
                        deliveredQty: 0,
                        invoicedQty: 0,
                        returnedQty: 0,
                        status: 'R',
                        allowPartialShipment: false,
                        cnvFactor: pdUom.cnvFactor,
                        baseUnitOrderedQty: orderedQty * pdUom.cnvFactor
                    }
                    const o: DocPo = {
                        docPoId: shortUUID.generate(),
                        docNo: `POSU${i.toString().padStart(4, '0')}`,
                        docDate: new Date().getTime(),
                        whId: 'dRF8jGphpQxRiCuuSNVybc',
                        suppId: supp.suppId,
                        refSuppName: supp.suppName,
                        taxRate: 7,
                        taxAmt: oitem.totalPrice * 7 / 100,
                        totalAmt: oitem.totalPrice + (oitem.totalPrice * 7 / 100),
                        status: 'R',
                        items: [oitem]
                    }
                    docPos.push(o)
                    i++
                })
                await this.addList({bid, brid, batch: true, data: docPos})
                await this.flush();
                resolve('OK')
            } catch(e) {
                reject(e)
            }
        })
    }

    updateWhId(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPos = await this.get({ bid, brid });
                docPos.forEach( docPo => {
                    docPo.whId = 'dRF8jGphpQxRiCuuSNVybc';
                })
                await this.flush();
                resolve(docPos)
            } catch(e) {
                reject(e)
            }
        })
    }

}
