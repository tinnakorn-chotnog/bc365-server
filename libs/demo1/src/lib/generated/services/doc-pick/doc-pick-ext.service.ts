import { DocPickService } from "./doc-pick.service";
import { WhSuExtService } from "../wh-su";
import { groupBy, keyBy } from "lodash";
import { DocPick } from "../../interfaces/doc-pick.model";
import { PdStorageExtService } from "../pd-storage";
import { RpnPlanExtService } from "../rpn-plan";
import { PdBranchExtService } from "../pd-branch";
import { PdWhExtService } from "../pd-wh";
import { PdAvailableByAisleReturnType, PdAvailableByRackReturnType, PdAvailableByShelfReturnType, PdAvailableByZoneReturnType } from "../pd-storage/pd-storage.interface";
import { PickPdInfo } from "../../interfaces/pick-pd-info.model";
import { WhZoneExtService } from "../wh-zone";
import { WhAisleExtService } from "../wh-aisle";
import { WhRackExtService } from "../wh-rack";
import { WhShelfExtService } from "../wh-shelf";

export class DocPickExtService extends DocPickService {

    get whSuService() {
        return this.modRef.get<WhSuExtService>(WhSuExtService)
    }

    get pdBranchService() {
        return this.modRef.get<PdBranchExtService>(PdBranchExtService)
    }

    get pdWhService() {
        return this.modRef.get<PdWhExtService>(PdWhExtService)
    }

    get pdStorageService() {
        return this.modRef.get<PdStorageExtService>(PdStorageExtService)
    }

    get rpnPlanService() {
        return this.modRef.get<RpnPlanExtService>(RpnPlanExtService)
    }

    get whZoneService() {
        return this.modRef.get<WhZoneExtService>(WhZoneExtService)
    }

    get whAisleService() {
        return this.modRef.get<WhAisleExtService>(WhAisleExtService)
    }

    get whRackService() {
        return this.modRef.get<WhRackExtService>(WhRackExtService)
    }

    get whShelfService() {
        return this.modRef.get<WhShelfExtService>(WhShelfExtService)
    }

    checkAvailabity(params: { bid: string; brid: string; docPickId?: string; docPick?: DocPick; update?: boolean; }) {
        return new Promise<PickPdInfo[]>( async (resolve, reject) => {

            try {

                let { bid, brid, docPickId, docPick, update } = params;

                if (!docPick && docPickId) {
                    docPick = await this.getById(bid, { id: docPickId });
                } else
                if (!docPick) {
                    throw new Error('Document not found')
                }

                docPick.status = 'R'

                if (!['N', 'R'].includes(docPick.status)) {
                    throw new Error('Document status must be NEW or RELEASED.')
                }

                const docPickPds = docPick.pd;
                const pdIds = docPickPds.map( pd => pd.pdId );
                const pdBranches = await this.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds } } });
                const pdBranchMap = keyBy(pdBranches, 'pdId');
                const whIds = docPick.pd.map( pd => pd.fromWhId)
                const whZones = await this.whZoneService.get({ bid, brid, filter: { _in: { whId: whIds } } })
                const whZoneMap = keyBy(whZones, 'whZoneId')
                const whAisles = await this.whAisleService.get({ bid, brid, filter: { _in: { whId: whIds } } })
                const whAisleMap = keyBy(whAisles, 'whAisleId')
                const whRacks = await this.whRackService.get({ bid, brid, filter: { _in: { whId: whIds } } })
                const whRackMap = keyBy(whRacks, 'whRackId')
                const whShelves = await this.whShelfService.get({ bid, brid, filter: { _in: { whId: whIds } } })
                const whShelfMap = keyBy(whShelves, 'whShelfId')
                const pdWhs = await this.pdWhService.get({ bid, brid, filter: { _and: [ { _in: { whId: whIds } }, { _in: { pdId: pdIds } } ] } });
                const pdWhMap = groupBy(pdWhs, 'pdId');
                const pdStorages = await this.pdStorageService.get({ bid, brid, filter: { _and: [ { _in: { whId: whIds } }, { _in: { pdId: pdIds } } ] } });
                const pdStorageMap = groupBy(pdStorages, 'whStorageId');

                const res = await Promise.all(docPick.pd.map( async pickPd => {
                    const pdBranch = pdBranchMap[pickPd.pdId];
                    const branchAvailQty = pdBranch?.ohQty || 0;
                    if (pickPd.qtyToPick > branchAvailQty) {
                        // console.log(pickPd.pdId, pickPd.qtyToPick,branchAvailQty);
                        pickPd.exception = {
                            exceptionCode: 'BS',
                            exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} in branch`,
                            exceptionQty: branchAvailQty - pickPd.qtyToPick,
                            exceptionResolved: false
                        }
                    } else {
                        const whs = pdWhMap[pickPd.pdId];
                        const pdWh = whs.find( wh => wh.whId === pickPd.fromWhId);
                        const whAvailQty = pdWh?.ohQty || 0;
                        if (pickPd.qtyToPick > whAvailQty) {
                            pickPd.exception = {
                                exceptionCode: 'WS',
                                exceptionMessage: `the quantity is not enough for product ${pdWh.refPdName} in warehouse ${pdWh.refWhName}`,
                                exceptionQty: whAvailQty - pickPd.qtyToPick,
                                exceptionResolved: false
                            }
                        } else {
                            pickPd.exception = null;
                            // Storage level
                            if (pickPd.fromStorageId) {
                                const pickPdStorages = pdStorageMap[pickPd.fromStorageId];
                                let pdStorage = pickPdStorages.find( pdStorage => pdStorage.pdId === pickPd.pdId);
                                if (pickPd.qtyToPick > (pdStorage?.ohQty || 0)) {
                                    pickPd.exception = {
                                        exceptionCode: 'SS',
                                        exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} in storage ${pdStorage.refStorageName}`,
                                        exceptionQty: pdStorage.ohQty - pickPd.qtyToPick,
                                        exceptionResolved: false
                                    }
                                }
                            } else
                            // Shelf level
                            if (pickPd.fromShelfId) {
                                let pdShelf = await this.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: pickPd.fromShelfId, pdId: pickPd.pdId, loadedStorages: pdStorages }) as PdAvailableByShelfReturnType;
                                if (pickPd.qtyToPick > pdShelf.ohQty) {
                                    pickPd.exception = {
                                        exceptionCode: 'SHS',
                                        exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} on shelf ${whShelfMap[pickPd.fromShelfId].whShelfName}`,
                                        exceptionQty: pdShelf.ohQty - pickPd.qtyToPick,
                                        exceptionResolved: false
                                    }
                                }
                            } else
                            // Rack level
                            if (pickPd.fromRackId) {
                                let pdRack = await this.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: pickPd.fromRackId, pdId: pickPd.pdId, loadedStorages: pdStorages }) as PdAvailableByRackReturnType;
                                if (pickPd.qtyToPick > pdRack.ohQty) {
                                    pickPd.exception = {
                                        exceptionCode: 'RS',
                                        exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} on rack ${whRackMap[pickPd.fromRackId].whRackName}`,
                                        exceptionQty: pdRack.ohQty - pickPd.qtyToPick,
                                        exceptionResolved: false
                                    }
                                }
                            } else
                            // Aisle level
                            if (pickPd.fromAisleId) {
                                let pdAisle = await this.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: pickPd.fromAisleId, pdId: pickPd.pdId, loadedStorages: pdStorages }) as PdAvailableByAisleReturnType;
                                if (pickPd.qtyToPick > pdAisle.ohQty) {
                                    pickPd.exception = {
                                        exceptionCode: 'AS',
                                        exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} on aisle ${whAisleMap[pickPd.fromAisleId].whAisleName}`,
                                        exceptionQty: pdAisle.ohQty - pickPd.qtyToPick,
                                        exceptionResolved: false
                                    }
                                }
                            } else
                            // Zone level
                            if (pickPd.fromZoneId) {
                                let pdZone = await this.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: pickPd.fromZoneId, pdId: pickPd.pdId, loadedStorages: pdStorages }) as PdAvailableByZoneReturnType;
                                if (pickPd.qtyToPick > pdZone.ohQty) {
                                    pickPd.exception = {
                                        exceptionCode: 'ZS',
                                        exceptionMessage: `the quantity is not enough for product ${pdBranch.pdName} in zone ${whZoneMap[pickPd.fromZoneId].whZoneName}`,
                                        exceptionQty: pdZone.ohQty - pickPd.qtyToPick,
                                        exceptionResolved: false
                                    }
                                }
                            }
                        }
                    }
                }));

                if (update) {
                    await this.update({ bid, brid, data: docPick });
                }

                resolve(docPick.pd.filter( p => p.exception !== null))

            } catch(e) {

                reject(e)

            }

        })

    }

}
