import { ModuleRef } from "@nestjs/core";
import { RpnPlanService } from "./rpn-plan.service";
import { RpnPlan } from "../../interfaces/rpn-plan.model";
import { PdStorage } from "../../interfaces/pd-storage.model";
import { PdExtService } from "../pd";
import { keyBy } from "lodash";
import { BranchExtService } from "../branch";
import { WhExtService } from "../wh";
import { PdBranchExtService } from "../pd-branch";
import { PdWhExtService } from "../pd-wh";
import { PdStorageExtService } from "../pd-storage";

export class RpnPlanExtService extends RpnPlanService {

    get branchService() {
        return this.modRef.get<BranchExtService>(BranchExtService)
    }

    get whService() {
        return this.modRef.get<WhExtService>(WhExtService)
    }

    get pdService() {
        return this.modRef.get<PdExtService>(PdExtService)
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

    createRpnPlanFromBranch(params: { bid: string, brid: string; }) {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid } = params;

                const branch = await this.branchService.getById(bid, { id: brid });

                const pds = await this.pdService.get({ bid, brid });
                const pdMap = keyBy(pds, 'pdId');
                const pdBranches = await this.pdBranchService.get({ bid, brid, filter: { ropSwitch: true } });

                const rpnRequests = pdBranches.filter( pdBranch => {
                    return pdBranch.ohQty <= pdBranch.rpnPref.ropQty
                })

                const rpnlans: RpnPlan[] = [];

                /*
                    rpnSrc: Replenishment Source (of requirement)
                    =============================================
                    1: Branch
                    2: Warehouse
                    3: Storage (bin or location)

                    rpnType: Replenishment Type
                    ==============================================
                    1: Purchase Requisition
                    2: Inter branch transfer
                    3: Inter warehouse transfer
                    4: Intra Warehouse transfer
                */

                rpnRequests.forEach( rpn => {
                    const pd = pdMap[rpn.pdId]
                    const rpnBranchId = rpn.rpnPref.rpnBranchId || branch.inventoryPreference.rpnBranchId;
                    const rpnQty = rpn.rpnPref.maxQty - rpn.ohQty;
                    const rpnPlan: RpnPlan = {
                        rpnPlanId: this.service.generateId(),
                        branchId: brid,
                        rpnQty: rpnQty,
                        rpnSrc: 'B',
                        rpnType: rpn.rpnPref.rpnType || '2',
                        suppId: pd.preferredSuppId,
                        rpnBranchId: rpnBranchId,
                        refPdBranchId: rpn.pdBranchId,
                        whControllerId: branch.inventoryPreference?.rpnControllerId
                    }
                    rpnlans.push(rpnPlan)

                })

                resolve(rpnlans)
            } catch(e) {
                reject(e)
            }
        })
    }

    createRpnPlanFromWh(params: { bid: string, brid: string; }) {
        return new Promise( async (resolve, reject) => {
            try {

                const { bid, brid } = params;

                const branch = await this.branchService.getById(bid, { id: brid });
                const whs = await this.whService.get({ bid, brid });
                const whMap = keyBy(whs, 'whId');

                const pds = await this.pdService.get({ bid, brid });
                const pdMap = keyBy(pds, 'pdId');
                const pdWhs = await this.pdWhService.get({ bid, brid, filter: { ropSwitch: true } });

                const rpnRequests = pdWhs.filter( pdWh => {
                    return pdWh.ohQty <= pdWh.ropQty
                })

                const rpnlans: RpnPlan[] = [];

                /*
                    rpnSrc: Replenishment Source (of requirement)
                    =============================================
                    B: Branch
                    W: Warehouse
                    S: Storage (bin or location)

                    rpnType: Replenishment Type
                    ==============================================
                    1: Purchase Requisition
                    2: Inter branch transfer
                    3: Inter warehouse transfer
                    4: Intra Warehouse transfer
                */

                rpnRequests.forEach( rpn => {
                    const wh = whMap[rpn.whId]
                    const controllerId = rpn.rpnPref.rpnControllerId || wh?.rpnControllerId || branch.inventoryPreference.rpnControllerId;
                    const rpnBranchId = rpn.rpnPref.rpnBranchId || wh?.rpnBranchId || branch.inventoryPreference.rpnBranchId;
                    const rpnWhId =  rpn.rpnPref.rpnWhId || wh?.rpnWhId
                    const rpnQty = rpn.maxQty - rpn.ohQty;
                    const pd = pdMap[rpn.pdId]
                    const rpnPlan: RpnPlan = {
                        rpnPlanId: this.service.generateId(),
                        branchId: brid,
                        rpnQty: rpnQty,
                        rpnSrc: 'W',
                        rpnType: rpn.rpnPref.rpnType || '3',
                        suppId: pd.preferredSuppId,
                        rpnBranchId: rpnBranchId,
                        rpnWhId: rpnWhId,
                        refPdWhId: rpn.pdWhId,
                        whControllerId: controllerId
                    }
                    rpnlans.push(rpnPlan)

                })

                resolve(rpnlans)
            } catch(e) {
                reject(e)
            }
        })
    }

    createRpnPlanFromStorage(params: { bid: string, brid: string; pdStorages?: PdStorage[]; }) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid, pdStorages } = params;

                const branch = await this.branchService.getById(bid, { id: brid });
                const whs = await this.whService.get({ bid, brid });
                const whMap = keyBy(whs, 'whId');

                if (!pdStorages) {
                    pdStorages = await this.pdStorageService.get({ bid, brid, filter: { ropSwitch: true } });
                }

                const rpnRequests = pdStorages.filter( pdStorage => {
                    return pdStorage.ohQty <= pdStorage.rpnPref.ropQty
                })

                const rpnlans: RpnPlan[] = [];

                /*
                    rpnSrc: Replenishment Source (of requirement)
                    =============================================
                    B: Branch
                    W: Warehouse
                    S: Storage (bin or location)

                    rpnType: Replenishment Type
                    ==============================================
                    1: Purchase Requisition
                    2: Inter branch transfer
                    3: Inter warehouse transfer
                    4: Intra warehouse transfer
                */

                rpnRequests.forEach( rpn => {
                    const wh = whMap[rpn.whId]
                    const controllerId = rpn.rpnPref.rpnControllerId || wh?.rpnControllerId || branch.inventoryPreference.rpnControllerId;
                    const rpnBranchId = rpn.rpnPref.rpnBranchId || wh?.rpnBranchId || branch.inventoryPreference.rpnBranchId;
                    const rpnWhId =  rpn.rpnPref.rpnWhId || wh?.rpnWhId
                    const rpnQty = rpn.rpnPref.maxQty - rpn.ohQty;
                    const rpnPlan: RpnPlan = {
                        rpnPlanId: this.service.generateId(),
                        branchId: brid,
                        rpnQty: rpnQty,
                        rpnSrc: 'S',
                        rpnType: rpn.rpnPref.rpnType || '4',
                        rpnBranchId: rpnBranchId,
                        rpnWhId: rpnWhId,
                        rpnZoneId: rpn.rpnPref.rpnZoneId,
                        rpnAisleId: rpn.rpnPref.rpnAisleId,
                        rpnRackId: rpn.rpnPref.rpnRackId,
                        rpnShelfId: rpn.rpnPref.rpnShelfId,
                        rpnStorageId: rpn.rpnPref.rpnStorageId,
                        refPdStorageId: rpn.pdStorageId,
                        whControllerId: controllerId
                    }
                    rpnlans.push(rpnPlan)
                })

                resolve(rpnlans)
            } catch(e) {
                reject(e)
            }
        })
    }

    assignPrefferedSupp(params: { bid: string, brid: string; }) {
        return new Promise( async (resolve, reject) => {
            try {

                let { bid, brid } = params;

                const pds = await this.pdService.get({ bid, brid });
                const pdMap = keyBy(pds, 'pdId');
                const rpnPlans = await this.get({ bid, brid, filter: { status: null }});

                rpnPlans.forEach( rpn => {
                    const pd = pdMap[rpn.pdId];
                    rpn.suppId = pd?.preferredSuppId;
                })

                await this.updateList({ bid, brid, data: rpnPlans, batch: true });
                await this.flush();

                resolve(true)
            } catch(e) {
                reject(e)
            }
        });
    }

}
