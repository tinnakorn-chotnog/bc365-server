import { DocPickExtService } from "./doc-pick-ext.service";
import { keyBy } from "lodash";
import { PdStorage } from "../../interfaces/pd-storage.model";

export class DocPickTestService extends DocPickExtService {

    testBranchException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdIds = pickPds.map( p => p.pdId );
                const pdBranches = await this.pdBranchService.get({ bid, brid, filter: { _in: { pdId: pdIds }}} );
                const pdBranchMap = keyBy(pdBranches, 'pdId');
                pickPds[0].qtyToPick = pdBranchMap[pickPds[0].pdId].ohQty + 2;
                pickPds[1].qtyToPick = pdBranchMap[pickPds[1].pdId].ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testWhException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdIds = pickPds.map( p => p.pdId );
                const whIds = pickPds.map( p => p.fromWhId );
                const pdWhs = await this.pdWhService.get({ bid, brid, filter: {  _and: [ { _in: { whId: whIds } }, { _in: { pdId: pdIds } } ] } } );
                const pd0Wh = pdWhs.find( pd => pd.pdId === pickPds[0].pdId && pd.whId === pickPds[0].fromWhId)
                const pd1Wh = pdWhs.find( pd => pd.pdId === pickPds[0].pdId && pd.whId === pickPds[0].fromWhId)
                pickPds[0].qtyToPick = pd0Wh?.ohQty + 2;
                pickPds[1].qtyToPick = pd1Wh?.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testZoneException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdZone0: any = await this.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: '2xMWkY66sZnsDfK5Rfgsdn', pdId: pickPds[0].pdId})
                const pdZone1: any = await this.pdStorageService.pdAvailableByZone({ bid, brid, whZoneId: '2xMWkY66sZnsDfK5Rfgsdn', pdId: pickPds[1].pdId})
                pickPds[0].fromZoneId = '2xMWkY66sZnsDfK5Rfgsdn'
                pickPds[1].fromZoneId = '2xMWkY66sZnsDfK5Rfgsdn'
                pickPds[0].qtyToPick = pdZone0.ohQty + 2;
                pickPds[1].qtyToPick = pdZone1.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testAisleException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdAisle0: any = await this.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: 'ggsyRdVhAyHYGtKKuSBVYc', pdId: pickPds[0].pdId})
                const pdAisle1: any = await this.pdStorageService.pdAvailableByAisle({ bid, brid, whAisleId: 'ggsyRdVhAyHYGtKKuSBVYc', pdId: pickPds[1].pdId})
                pickPds[0].fromAisleId = 'ggsyRdVhAyHYGtKKuSBVYc'
                pickPds[1].fromAisleId = 'ggsyRdVhAyHYGtKKuSBVYc'
                pickPds[0].qtyToPick = pdAisle0.ohQty + 2;
                pickPds[1].qtyToPick = pdAisle1.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testRackException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdRack0: any = await this.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: 'ioJ3dTEciBE2NPdTrmKZtf', pdId: pickPds[0].pdId})
                const pdRack1: any = await this.pdStorageService.pdAvailableByRack({ bid, brid, whRackId: 'ioJ3dTEciBE2NPdTrmKZtf', pdId: pickPds[1].pdId})
                pickPds[0].fromRackId = 'ioJ3dTEciBE2NPdTrmKZtf'
                pickPds[1].fromRackId = 'ioJ3dTEciBE2NPdTrmKZtf'
                pickPds[0].qtyToPick = pdRack0.ohQty + 2;
                pickPds[1].qtyToPick = pdRack1.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testShelfException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdShelf0: any = await this.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: 'uJVfKagMeGMzybZCXjfELL', pdId: pickPds[0].pdId})
                const pdShelf1: any = await this.pdStorageService.pdAvailableByShelf({ bid, brid, whShelfId: 'uJVfKagMeGMzybZCXjfELL', pdId: pickPds[1].pdId})
                pickPds[0].fromShelfId = 'uJVfKagMeGMzybZCXjfELL'
                pickPds[1].fromShelfId = 'ioJ3dTEciBE2NPdTrmKZtf'
                pickPds[0].qtyToPick = pdShelf0.ohQty + 2;
                pickPds[1].qtyToPick = pdShelf1.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

    testStorageException(bid: string, brid: string, docPickId: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const docPick = await this.getById(bid, { id: docPickId });
                const pickPds = docPick.pd;
                const pdIds = pickPds.map( p => p.pdId );
                const pdStorages = await this.pdStorageService.get({ bid, brid, filter: { _and: [ { whId: docPick.whId }, { _in: { pdId: pdIds } } ] } } );
                const pdStorageMap = keyBy(pdStorages, 'pdId');
                const pdStorage0: PdStorage = pdStorageMap[pickPds[0].pdId];
                const pdStorage1: PdStorage = pdStorageMap[pickPds[1].pdId];
                pickPds[0].fromStorageId = pdStorage0.whStorageId;
                pickPds[1].fromStorageId = pdStorage1.whStorageId;
                pickPds[0].qtyToPick = pdStorage0.ohQty + 2;
                pickPds[1].qtyToPick = pdStorage1.ohQty + 2;
                const res = await this.checkAvailabity({ bid, brid, docPick })
                resolve(res)
            } catch(e) {
                reject(e)
            }
        })
    }

}
