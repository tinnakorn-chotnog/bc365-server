import { DocGrnExtService } from "./doc-grn-ext.service";
import { DocGrn } from "../../interfaces/doc-grn.model";
import { groupBy } from "lodash";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdUom } from "../../interfaces/pd-uom.model";

export class DocGrnTestService extends DocGrnExtService {

    suppIds =  ["aJj6HgrY7Le2PLau4kaFng", "erW74MqRNwHKRyz7tfjcuK", "nYRQnrxgnyh7aUGhc8jKUj", "61a8FdmcrXkVde3DAbzNzP", "mjnTZNDxLbebWYZ4P81K13"]


    createGrn(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdUoms = await this.pdUomService.get({ bid, brid });
                const pdUomMap: { [pdId: string]: PdUom[] } = groupBy(pdUoms, 'pdId');
                const pdStorages = await this.pdStorageService.get({ bid, brid });
                const pdStorageMap: { [pdId: string]: PdStorage[] } = groupBy(pdStorages, 'pdId');
                const pdIds = Object.keys(pdStorageMap)
                const docGrns: DocGrn[] = [];
                [1, 2, 3, 4, 5].forEach( i => {
                    const docGrn: DocGrn = {
                        docGrnId: this.service.generateId(),
                        docNo: `GRN${i.toString().padStart(4, '0')}`,
                        docDate: new Date().getTime(),
                        suppId: this.suppIds[i-1],
                        status: 'R',
                        items: [
                            {
                                itemId: this.service.generateId(),
                                pdId: pdStorageMap[pdIds[i-1]][0].pdId,
                                receivedQty: 50,
                                pdUomId: pdUomMap[pdIds[i-1]][1].pdUomId,
                                whStorageId: pdStorageMap[pdIds[i-1]][0].whStorageId,
                                suReceive: null
                            }
                        ]
                    }
                    docGrns.push(docGrn)
                })

                await this.addList({ bid, brid, data: docGrns, batch: true })

                // await this.flush();

                resolve(docGrns)

            } catch(e) {
                reject(e)
            }
        })

    }

    createGrnWithLot(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const pdUoms = await this.pdUomService.get({ bid, brid });
                const pdUomMap: { [pdId: string]: PdUom[] } = groupBy(pdUoms, 'pdId');
                const pdLotStorages = await this.pdLotStorageService.get({ bid, brid });
                const pdLotStorageMap = groupBy(pdLotStorages, 'pdId');
                const pdIds = Object.keys(pdLotStorageMap)
                console.log(pdIds)
                const docGrns: DocGrn[] = [];
                [1, 2, 3, 4, 5].forEach( i => {
                    const pdId = pdIds[i-1];
                    console.log(pdId, pdLotStorageMap[pdId])
                    const docGrn: DocGrn = {
                        docGrnId: this.service.generateId(),
                        docNo: `GRNL${i.toString().padStart(4, '0')}`,
                        docDate: new Date().getTime(),
                        suppId: this.suppIds[i-1],
                        status: 'R',
                        items: [
                            {
                                itemId: this.service.generateId(),
                                pdId: pdIds[i-1],
                                receivedQty: 50,
                                useLot: true,
                                pdUomId: pdUomMap[pdIds[i-1]][1].pdUomId,
                                whStorageId: pdLotStorageMap[pdIds[i-1]][0].whStorageId,
                                pdLotId: pdLotStorageMap[pdIds[i-1]][0].pdLotId,
                                suReceive: null
                            }
                        ]
                    }
                    docGrns.push(docGrn)
                })

                await this.addList({ bid, brid, data: docGrns, batch: true })

                await this.flush();

                await this.pdLotStorageService.flush();

                resolve(docGrns)

            } catch(e) {
                reject(e)
            }
        })

    }

    createGrnWithSu(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docGrns: DocGrn[] = [];
                [1, 2, 3, 4, 5].forEach( i => {
                    const suList = [1, 2, 3, 4, 5].map( j => {
                        return { suNo: `P-${i.toString().padStart(2, '0')}-${j.toString().padStart(2, '0')}`, receivedQty: 10 }
                    })
                    const docGrn: DocGrn = {
                        docGrnId: this.service.generateId(),
                        docNo: `GRNSU${i.toString().padStart(4, '0')}`,
                        docDate: new Date().getTime(),
                        suppId: this.suppIds[i-1],
                        status: 'R',
                        items: [
                            {
                                itemId: this.service.generateId(),
                                pdId: 'kQY4BtXQUNsq5FF4p1oP1n',
                                receivedQty: 50,
                                pdUomId: 'o1gJGcXikvDgxqggktbcgP',
                                pdLotId: 'f5ueFrpqaCX6qsS87fgJpa',
                                whStorageId: 'exQJZMLa5W1YeX5V7ERGLa',
                                applySu: true,
                                suReceive: {
                                    suTypeId: 'wVpQmsjubFVpzjfxvFLBJH',
                                    numOfSu: 5,
                                    qtyPerSu: 10,
                                    suList: suList
                                }
                            }
                        ]
                    }
                    docGrns.push(docGrn)
                })

                await this.addList({ bid, brid, data: docGrns, batch: true })

                await this.flush();

                await this.whSuService.flush();

                await this.pdSuService.flush();

                await this.pdLotStorageService.flush();

                resolve(docGrns)

            } catch(e) {
                reject(e)
            }
        })

    }

    testReceiveStorage(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {

                const pdUom = await this.pdUomService.getOne({ bid, brid, filter: { pdUomId: '1n4HHiVQaHUJ1KWAqAq3GA' }});

                const docGrn: DocGrn = {
                    docGrnId: this.service.generateId(),
                    docNo: "0001",
                    docDate: new Date().getTime(),
                    status: 'R',
                    items: [
                        {
                            itemId: this.service.generateId(),
                            pdId: 'iUgggMLiR1xtPnkQzzvAQG',
                            receivedQty: 5,
                            pdUomId: pdUom.pdUomId,
                            cnvFactor: pdUom.cnvFactor,
                            whStorageId: '6XK1sHJeumqwjXE8tZre9b',
                            pdStorageId: 'rx5sobM2MpMRpuVbVnaCiv'
                        }
                    ]
                }

                resolve('OK')

            } catch(e) {

                reject(e)
            }
        })
    }

}
