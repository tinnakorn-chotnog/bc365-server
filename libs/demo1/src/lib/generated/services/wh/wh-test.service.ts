import { WhExtService } from "./wh-ext.service";
import shortUUID from "short-uuid";
import { WhAisle } from "../../interfaces/wh-aisle.model";
import { WhRack } from "../../interfaces/wh-rack.model";
import { WhShelf } from "../../interfaces/wh-shelf.model";
import { WhStorage } from "../../interfaces/wh-storage.model";
import { WhZone } from "../../interfaces/wh-zone.model";
import { WhStorageType } from "../../interfaces/wh-storage-type.model";
import { keyBy } from "lodash";
import { WhStorageTypeExtService } from "../wh-storage-type";
import { WhAisleExtService } from "../wh-aisle";
import { WhRackExtService } from "../wh-rack";
import { WhShelfExtService } from "../wh-shelf";
import { WhZoneExtService } from "../wh-zone";
import { WhStorageRestriction } from "../../interfaces/wh-storage-restriction.model";
import { WhStorageRestrictionExtService } from "../wh-storage-restriction";
import { PoolClient } from "pg";
import { HuTypeExtService } from "../hu-type";
import { WhHu } from "../../interfaces/wh-hu.model";
import { HuType } from "../../interfaces/hu-type.model";
import { writeFileSync } from "fs-extra";
import { BranchExtService } from "../branch";
import { SuType } from "../../interfaces/su-type.model";
import { Wh } from "../../interfaces/wh.model";
import { WhSu } from "../../interfaces/wh-su.model";
import { SuTypeExtService } from "../su-type";

export class WhTestService extends WhExtService {

    get branchService() {
        return this.modRef.get<BranchExtService>(BranchExtService)
    }

    get whStorageTypeService() {
        return this.modRef.get<WhStorageTypeExtService>(WhStorageTypeExtService)
    }

    get whStorageRestrictionService() {
        return this.modRef.get<WhStorageRestrictionExtService>(WhStorageRestrictionExtService)
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

    get huTypeService() {
        return this.modRef.get<HuTypeExtService>(HuTypeExtService)
    }

    get suTypeService() {
        return this.modRef.get<SuTypeExtService>(SuTypeExtService)
    }

    createTestData(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {

            let sharedClient: any;

            try {

                sharedClient = await this.service.bizConnect(bid)

                let whStorageRestrictions: WhStorageRestriction[] = await this.whStorageRestrictionService.get({ bid, brid });
                let addWhStorageRestriction = false;

                if (!whStorageRestrictions || whStorageRestrictions.length === 0) {
                    addWhStorageRestriction = true;
                    whStorageRestrictions = [
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'RCV', restrictionName: 'Receivable', allowIssue: false, allowPick: false, allowReceive: true, allowTransfer: true},
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'PACK', restrictionName: 'Packable', allowIssue: true, allowPick: false, allowReceive: false, allowTransfer: true},
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'SHIP', restrictionName: 'Ship', allowIssue: true, allowPick: false, allowReceive: false, allowTransfer: true},
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'LHU', restrictionName: 'Large HU', allowIssue: false, allowPick: false, allowReceive: false, allowTransfer: true},
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'PCK', restrictionName: 'Pickable', allowIssue: false, allowPick: true, allowReceive: false, allowTransfer: true},
                        { whStorageRestrictionId: this.service.generateId(), restrictionNo: 'GEN', restrictionName: 'General', allowIssue: true, allowPick: true, allowReceive: false, allowTransfer: true},
                    ]
                }

                const whStorageRestrictionMap = keyBy(whStorageRestrictions, 'restrictionNo');

                let whStorageTypes: WhStorageType[] = await this.whStorageTypeService.get({ bid, brid });
                let addWhStorageType = false;

                if (!whStorageTypes || whStorageTypes.length === 0) {
                    addWhStorageType = true;
                    whStorageTypes = [
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '10', whStorageTypeName: 'Rack bulk storage', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '11', whStorageTypeName: 'Rack general storage', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '20', whStorageTypeName: 'Receiving dock', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '30', whStorageTypeName: 'Picking area', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '40', whStorageTypeName: 'Packing area', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '50', whStorageTypeName: 'Shipping dock', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '60', whStorageTypeName: 'Rack storage bin', movable: false},
                        { whStorageTypeId: this.service.generateId(), whStorageTypeNo: '70', whStorageTypeName: 'Ground storage area', movable: false},
                    ];
                }

                const whStorageTypeMap = keyBy(whStorageTypes, 'whStorageTypeNo');

                let huTypes: HuType[] = await this.huTypeService.get({ bid, brid });
                let addHuType = false;

                if (!huTypes || huTypes.length === 0) {
                    addHuType = true;
                    huTypes = [
                        { huTypeId: this.service.generateId(), huTypeNo: '01', huTypeName: 'Container'},
                        { huTypeId: this.service.generateId(), huTypeNo: '02', huTypeName: 'Pallet'},
                        { huTypeId: this.service.generateId(), huTypeNo: '03', huTypeName: 'Crate'},
                        { huTypeId: this.service.generateId(), huTypeNo: '04', huTypeName: 'Tote'},
                        { huTypeId: this.service.generateId(), huTypeNo: '05', huTypeName: 'Single tote picking cart'},
                        { huTypeId: this.service.generateId(), huTypeNo: '06', huTypeName: 'Multi-tote picking cart'},
                    ]
                }

                const huTypeMap = keyBy(huTypes, 'huTypeNo')

                let suTypes: SuType[] = await this.suTypeService.get({ bid, brid });
                let addSuType = false;

                if (!suTypes || suTypes.length === 0) {
                    addSuType = true;
                    suTypes = [
                        { suTypeId: this.service.generateId(), suTypeNo: '01', suTypeName: 'Container'},
                        { suTypeId: this.service.generateId(), suTypeNo: '02', suTypeName: 'Pallet'},
                        { suTypeId: this.service.generateId(), suTypeNo: '03', suTypeName: 'Crate'},
                        { suTypeId: this.service.generateId(), suTypeNo: '04', suTypeName: 'Tote'},
                        { suTypeId: this.service.generateId(), suTypeNo: '05', suTypeName: 'Single tote picking cart'},
                        { suTypeId: this.service.generateId(), suTypeNo: '06', suTypeName: 'Multi-tote picking cart'},
                    ];
                }

                const suTypeMap = keyBy(suTypes, 'suTypeNo')

                const branches = await this.branchService.get({ bid, brid, skipBridCheck: true })

                let whs:Wh[] = await this.get({ bid, brid, skipBridCheck: true })
                let addWh = false;

                if (!whs || whs.length === 0) {
                    addWh = true;
                    branches.forEach( branch => {
                        const wh: Wh[] = [
                            {"whId":this.service.generateId(), "bizId":bid, "branchId":branch.branchId, "whNo":"001-000", "whName":"Warehouse 1", "addr":null, "contact":null, "virtual":false,"suspended":false,"defaultWhStorageId":null,"receivingWhStorageId":null,"pickingWhStorageId":null,"packingWhStorageId":null,"shippingWhStorageId":null},
                            {"whId":this.service.generateId(), "bizId":bid, "branchId":branch.branchId, "whNo":"001-001", "whName":"Warehouse 2", "addr":null, "contact":null, "virtual":false,"suspended":false,"defaultWhStorageId":null,"receivingWhStorageId":null,"pickingWhStorageId":null,"packingWhStorageId":null,"shippingWhStorageId":null},
                        ]
                        whs.push(...wh)
                    })
                }

                await Promise.all(whs.map( async wh => {

                    let whZones: WhZone[] = await this.whZoneService.get({ bid, brid: wh.branchId, filter: { whId: wh.whId}});
                    let addWhZone = false;

                    if (!whZones || whZones.length === 0) {
                        addWhZone = true;
                        whZones = [
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z01', whZoneName: 'WhZone 1', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z02', whZoneName: 'WhZone 2', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z03', whZoneName: 'WhZone 3', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z04', whZoneName: 'WhZone 4', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z05', whZoneName: 'WhZone 5', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z06', whZoneName: 'WhZone 6', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whZoneId: this.service.generateId(), whZoneNo: 'Z07', whZoneName: 'WhZone 7', whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                        ]
                    }

                    const whZoneMap = keyBy(whZones, 'whZoneId')

                    let whAisles: WhAisle[] = await this.whAisleService.get({ bid, brid: wh.branchId, filter: { whId: wh.whId }});
                    let addWhAisle = false;

                    if (!whAisles || whAisles.length === 0) {
                        addWhAisle = true;
                        whAisles = [
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-1', whAisleName: 'WhAisle 1', whId: wh.whId, whZoneId: whZones[0].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-2', whAisleName: 'WhAisle 2', whId: wh.whId, whZoneId: whZones[1].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-3', whAisleName: 'WhAisle 3', whId: wh.whId, whZoneId: whZones[2].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-4', whAisleName: 'WhAisle 4', whId: wh.whId, whZoneId: whZones[3].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-5', whAisleName: 'WhAisle 5', whId: wh.whId, whZoneId: whZones[4].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-6', whAisleName: 'WhAisle 6', whId: wh.whId, whZoneId: whZones[5].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                            { whAisleId: this.service.generateId(), whAisleNo: 'AS-7', whAisleName: 'WhAisle 7', whId: wh.whId, whZoneId: whZones[6].whZoneId, bizId: wh.bizId, branchId: wh.branchId},
                        ]
                    }

                    const whAisleMap = keyBy(whAisles, 'whAisleId')

                    let whRacks: WhRack[] = await this.whRackService.get({ bid, brid: wh.branchId, filter: { whId: wh.whId }});
                    let addWhRack = false;

                    if (!whRacks || whRacks.length === 0) {
                        addWhRack = true;
                        whRacks = [
                            { whRackId: this.service.generateId(), whRackNo: '01', whRackName: 'WhRack 1', whAisleId: whAisles[0].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '02', whRackName: 'WhRack 2', whAisleId: whAisles[1].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '03', whRackName: 'WhRack 3', whAisleId: whAisles[1].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '04', whRackName: 'WhRack 4', whAisleId: whAisles[2].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '05', whRackName: 'WhRack 5', whAisleId: whAisles[2].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '06', whRackName: 'WhRack 6', whAisleId: whAisles[3].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '07', whRackName: 'WhRack 7', whAisleId: whAisles[3].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '08', whRackName: 'WhRack 8', whAisleId: whAisles[4].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '09', whRackName: 'WhRack 9', whAisleId: whAisles[4].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '10', whRackName: 'WhRack 10', whAisleId: whAisles[5].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '11', whRackName: 'WhRack 11', whAisleId: whAisles[5].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            { whRackId: this.service.generateId(), whRackNo: '12', whRackName: 'WhRack 12', whAisleId: whAisles[6].whAisleId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                        ]
                    }

                    const whRackMap = keyBy(whRacks, 'whRackId')

                    const whShelfs: WhShelf[] = await this.whShelfService.get({ bid, brid: wh.branchId, filter: { whId: wh.whId }});
                    let addWhShelf = false;
                    let newShelfs: WhShelf[] = [];

                    whRacks.forEach( whRack => {
                        const _shelfs = whShelfs.filter( s => s.whRackId === whRack.whRackId)
                        if (_shelfs.length === 0) {
                            addWhShelf = true;
                            const data: WhShelf[] = [
                                { whShelfId: this.service.generateId(), whShelfNo: `${whRack.whRackNo}-01` , whShelfName: `${whRack.whRackName} whShelf 1`, whRackId: whRack.whRackId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                                { whShelfId: this.service.generateId(), whShelfNo: `${whRack.whRackNo}-02` , whShelfName: `${whRack.whRackName} whShelf 2`, whRackId: whRack.whRackId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                                { whShelfId: this.service.generateId(), whShelfNo: `${whRack.whRackNo}-03` , whShelfName: `${whRack.whRackName} whShelf 3`, whRackId: whRack.whRackId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                                { whShelfId: this.service.generateId(), whShelfNo: `${whRack.whRackNo}-04` , whShelfName: `${whRack.whRackName} whShelf 4`, whRackId: whRack.whRackId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                                { whShelfId: this.service.generateId(), whShelfNo: `${whRack.whRackNo}-05` , whShelfName: `${whRack.whRackName} whShelf 5`, whRackId: whRack.whRackId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId},
                            ]
                            newShelfs.push(...data);
                        }
                    })

                    const whShelfMap = keyBy(whShelfs, 'whShelfId')

                    const whStorages: WhStorage[] = await this.whStorageService.get({ bid, brid: wh.branchId, filter: { whId: wh.whId }});;
                    let addWhStorage = false;
                    let newWhStorages: WhStorage[] = [];

                    whShelfs.forEach( whShelf => {

                        const _storages = whStorages.filter( s => s.whShelfId === whShelf.whShelfId);

                        if (_storages.length === 0) {

                            const s = whShelf.whShelfNo.slice(-2);
                            const whRack = whRackMap[whShelf.whRackId];
                            const whAisle = whAisleMap[whRack.whAisleId]
                            const whZone = whZoneMap[whAisle.whZoneId];

                            let whStorageTypeId;

                            if (['04','05'].includes(s)) {
                                whStorageTypeId = whStorageTypeMap['10'].whStorageTypeId;
                            } else {
                                whStorageTypeId = whStorageTypeMap['11'].whStorageTypeId;
                            }

                            const data: WhStorage[] = [
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-01`, storageName: `${whShelf.whShelfName} bin 1`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-02`, storageName: `${whShelf.whShelfName} bin 2`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-03`, storageName: `${whShelf.whShelfName} bin 3`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-04`, storageName: `${whShelf.whShelfName} bin 4`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-05`, storageName: `${whShelf.whShelfName} bin 5`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-06`, storageName: `${whShelf.whShelfName} bin 6`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-07`, storageName: `${whShelf.whShelfName} bin 7`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-08`, storageName: `${whShelf.whShelfName} bin 8`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-09`, storageName: `${whShelf.whShelfName} bin 9`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-10`, storageName: `${whShelf.whShelfName} bin 10`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-11`, storageName: `${whShelf.whShelfName} bin 11`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-12`, storageName: `${whShelf.whShelfName} bin 12`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-13`, storageName: `${whShelf.whShelfName} bin 13`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-14`, storageName: `${whShelf.whShelfName} bin 14`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-15`, storageName: `${whShelf.whShelfName} bin 15`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-16`, storageName: `${whShelf.whShelfName} bin 16`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-17`, storageName: `${whShelf.whShelfName} bin 17`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-18`, storageName: `${whShelf.whShelfName} bin 18`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-19`, storageName: `${whShelf.whShelfName} bin 19`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-20`, storageName: `${whShelf.whShelfName} bin 20`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-21`, storageName: `${whShelf.whShelfName} bin 21`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-22`, storageName: `${whShelf.whShelfName} bin 22`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-23`, storageName: `${whShelf.whShelfName} bin 23`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-24`, storageName: `${whShelf.whShelfName} bin 24`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-25`, storageName: `${whShelf.whShelfName} bin 25`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-26`, storageName: `${whShelf.whShelfName} bin 26`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-27`, storageName: `${whShelf.whShelfName} bin 27`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-28`, storageName: `${whShelf.whShelfName} bin 28`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-29`, storageName: `${whShelf.whShelfName} bin 29`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                                { whStorageId: this.service.generateId(), storageNo: `${whShelf.whShelfNo}-30`, storageName: `${whShelf.whShelfName} bin 30`, whShelfId: whShelf.whShelfId, whStorageTypeId: whStorageTypeId, whId: wh.whId, whZoneId: whZone.whZoneId, whAisleId: whAisle.whAisleId, whRackId: whRack.whRackId, whStorageRestrictionId: whStorageRestrictionMap['GEN'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId},
                            ]

                            newWhStorages.push(...data);
                            whStorages.push(...data);
                        }

                    })

                    const whStorageMap = keyBy(whStorages, 'storageNo');

                    if (!whStorageMap['RECV-DOCK-1']) {
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `RECV-DOCK-1`, storageName: `Receiving dock 1`, whStorageTypeId: whStorageTypeMap['20'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId});
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `RECV-DOCK-2`, storageName: `Receiving dock 2`, whStorageTypeId: whStorageTypeMap['20'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId});
                    }
                    if (!whStorageMap['PICK-STATION-1']) {
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `PICK-STATION-1`, storageName: `Picking Station 1`, whStorageTypeId: whStorageTypeMap['30'].whStorageTypeId, whId: wh.whId, whStorageRestrictionId: whStorageRestrictionMap['PCK'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId})
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `PICK-STATION-2`, storageName: `Picking Station 2`, whStorageTypeId: whStorageTypeMap['30'].whStorageTypeId, whId: wh.whId, whStorageRestrictionId: whStorageRestrictionMap['PCK'].whStorageRestrictionId, bizId: wh.bizId, branchId: wh.branchId})
                    }
                    if (!whStorageMap['PACK-STATION-1']) {
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `PACK-STATION-1`, storageName: `Packing Station 1`, whStorageTypeId: whStorageTypeMap['40'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `PACK-STATION-2`, storageName: `Packing Station 2`, whStorageTypeId: whStorageTypeMap['40'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                    }
                    if (!whStorageMap['SHIP-DOCK-1']) {
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `SHIP-DOCK-1`, storageName: `Shipping dock 1`, whStorageTypeId: whStorageTypeMap['50'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `SHIP-DOCK-2`, storageName: `Shipping dock 2`, whStorageTypeId: whStorageTypeMap['50'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                    }
                    if (!whStorageMap['TEMP-LOCATION-1']) {
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `TEMP-LOCATION-1`, storageName: `Temporary storage 1`, whStorageTypeId: whStorageTypeMap['70'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                        newWhStorages.push({ whStorageId: this.service.generateId(), storageNo: `TEMP-LOCATION-2`, storageName: `Temporary storage 2`, whStorageTypeId: whStorageTypeMap['70'].whStorageTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId})
                    }


                    const whHus: WhHu[] = await this.whHuService.get({ bid, brid, filter: { _and: [ {branchId: wh.branchId}, {whId: wh.whId} ] } });
                    const whSus: WhSu[] = await this.whSuService.get({ bid, brid, filter: { _and: [ {branchId: wh.branchId}, {whId: wh.whId} ] } });
                    let addWhSuHu = false;

                    if (whHus.length === 0 && whSus.length === 0) {

                        addWhSuHu = true;

                        const huPalletes: WhHu[] = Array.from({length: 100}, (_, index) => {
                            const i = index + 1;
                            const whHu: WhHu = { whHuId: this.service.generateId(), huNo: `${wh.whNo}-P${i.toString().padStart(3,'0')}`, huTypeId: huTypeMap['02'].huTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whHu;
                        });

                        const suPalletes: WhSu[] = Array.from({length: 100}, (_, index) => {
                            const i = index + 1;
                            const whSu: WhSu = { whSuId: this.service.generateId(), suNo: `${wh.whNo}-P${i.toString().padStart(3,'0')}`, suTypeId: suTypeMap['02'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whSu;
                        });

                        whHus.push(...huPalletes)

                        whSus.push(...suPalletes)

                        const huTotes = Array.from({length: 100}, (_, index) => {
                            const i = index + 1;
                            const whHu: WhHu = { whHuId: this.service.generateId(), huNo: `${wh.whNo}-T${i.toString().padStart(3,'0')}`, huTypeId: huTypeMap['04'].huTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whHu;
                        });

                        const suTotes = Array.from({length: 100}, (_, index) => {
                            const i = index + 1;
                            const whSu: WhSu = { whSuId: this.service.generateId(), suNo: `${wh.whNo}-T${i.toString().padStart(3,'0')}`,  suTypeId: suTypeMap['04'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whSu;
                        });

                        whHus.push(...huTotes)

                        whSus.push(...suTotes)

                        const huScarts = Array.from({length: 20}, (_, index) => {
                            const i = index + 1;
                            const whHu: WhHu = { whHuId: this.service.generateId(), huNo: `${wh.whNo}-SPC${i.toString().padStart(3,'0')}`, huTypeId: huTypeMap['05'].huTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whHu;
                        });

                        const suScarts = Array.from({length: 20}, (_, index) => {
                            const i = index + 1;
                            const whSu: WhSu = { whSuId: this.service.generateId(), suNo: `${wh.whNo}-SPC${i.toString().padStart(3,'0')}`, suTypeId: suTypeMap['05'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whSu;
                        });

                        whHus.push(...huScarts)

                        whSus.push(...suScarts)

                        const huCartToteIdx = 100;
                        const huMcarts = Array.from({length: 20}, (_, index) => {
                            const i = index + 1;
                            const whHuId = this.service.generateId();
                            const cartTotes = Array.from({length: 12}, (_, toteIndex) => {
                                const j = huCartToteIdx + toteIndex + 1;
                                const tote: WhHu = { whHuId: this.service.generateId(), huNo: `${wh.whNo}-T${j.toString().padStart(3,'0')}` , huTypeId: suTypeMap['04'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId, parentHuId: whHuId}
                                return tote;
                            });
                            whHus.push(...cartTotes)
                            const whHu: WhHu = { whHuId: whHuId, huNo: `${wh.whNo}-MPC${i.toString().padStart(3,'0')}`,  huTypeId: huTypeMap['06'].huTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whHu;
                        });

                        const suCartToteIdx = 100;
                        const suMcarts = Array.from({length: 20}, (_, index) => {
                            const i = index + 1;
                            const whSuId = this.service.generateId();
                            const cartTotes = Array.from({length: 12}, (_, toteIndex) => {
                                const j = suCartToteIdx + toteIndex + 1;
                                const tote: WhSu = { whSuId: this.service.generateId(), suNo: `${wh.whNo}-T${j.toString().padStart(3,'0')}` , suTypeId: suTypeMap['04'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId, parentSuId: whSuId}
                                return tote;
                            });
                            whSus.push(...cartTotes)
                            const whSu: WhSu = { whSuId: whSuId, suNo: `${wh.whNo}-MPC${i.toString().padStart(3,'0')}`, suTypeId: suTypeMap['06'].suTypeId, whId: wh.whId, bizId: wh.bizId, branchId: wh.branchId}
                            return whSu;
                        });

                        whHus.push(...huMcarts)

                        whSus.push(...suMcarts)

                    }

                    try {
                        if (addWhZone) {
                            await this.whZoneService.addList({ bid, brid: brid, data: whZones, skipBridCheck: true, batch: true, sharedClient });
                        }
                        if (addWhAisle) {
                            await this.whAisleService.addList({ bid, brid: brid, data: whAisles, skipBridCheck: true, batch: true, sharedClient });
                        }
                        if ( addWhRack) {
                            await this.whRackService.addList({ bid, brid: brid, data: whRacks, skipBridCheck: true, batch: true, sharedClient });
                        }
                        if (addWhShelf) {
                            await this.whShelfService.addList({ bid, brid: brid, data: newShelfs, skipBridCheck: true, batch: true,  sharedClient });
                        }
                        if (addWhStorage) {
                            await this.whStorageService.addList({ bid, brid: brid, data: newWhStorages, skipBridCheck: true, batch: true, sharedClient });
                        }
                        if (addWhSuHu) {
                            await this.whHuService.addList({ bid, brid: brid, data: whHus, skipBridCheck: true, batch: true, sharedClient });
                            await this.whSuService.addList({ bid, brid: brid, data: whSus, skipBridCheck: true, batch: true, sharedClient });
                        }
                        return 'OK'
                    } catch(e) {
                        console.log(e)
                        return null;
                    }

                }))

                if (addHuType) {
                    await this.huTypeService.addList({ bid, brid, data: huTypes, skipBridCheck: true, batch: true, sharedClient });
                }
                if (addSuType) {
                    await this.suTypeService.addList({ bid, brid, data: suTypes, skipBridCheck: true, batch: true, sharedClient });
                }
                if (addWhStorageType) {
                    await this.whStorageTypeService.addList({ bid, brid, data: whStorageTypes, skipBridCheck: true, batch: true, sharedClient });
                }
                if (addWhStorageRestriction) {
                    await this.whStorageRestrictionService.addList({ bid, brid, data: whStorageRestrictions, skipBridCheck: true, batch: true, sharedClient });
                }
                if (addWh) {
                    await this.addList({ bid, brid, data: whs, skipBridCheck: true, batch: true, sharedClient });
                }

                resolve('OK')
            } catch(e) {
                reject(e)
            } finally {
                try {
                    await this.whZoneService.flush();
                    await this.whAisleService.flush();
                    await this.whRackService.flush();
                    await this.whShelfService.flush();
                    await this.whStorageService.flush();
                    await this.whHuService.flush();
                    await this.whSuService.flush();
                    await this.huTypeService.flush();
                    await this.suTypeService.flush();
                    await this.whStorageRestrictionService.flush();
                    await this.whStorageTypeService.flush()
                    await this.flush();
                } catch(e) {
                    // console.log(e)
                }
            }
        })
    }

    updateDefaultStorage(bid: string, brid: string) {
        return new Promise( async (resolve, reject) => {
            try {
                const whs = await this.get({ bid, brid, skipBridCheck: true});
                const res = await Promise.all(whs.map( async wh => {
                    const storages = await this.whStorageService.get({ bid, brid, skipBridCheck: true, filter: { whId: wh.whId } });
                    const defaultWhStorageIdx = storages.findIndex( s => s.storageNo === 'TEMP-LOCATION-1');
                    const receivingWhStorageIdx = storages.findIndex( s => s.storageNo === 'RECV-DOCK-1');
                    const pickingWhStorageIdx = storages.findIndex( s => s.storageNo === 'PICK-STATION-1');
                    const packingWhStorageIdx = storages.findIndex( s => s.storageNo === 'PACK-STATION-1');
                    const shippingWhStorageIdx = storages.findIndex( s => s.storageNo === 'SHIP-DOCK-1');
                    console.log(defaultWhStorageIdx, receivingWhStorageIdx, pickingWhStorageIdx, packingWhStorageIdx, shippingWhStorageIdx)
                    wh.defaultWhStorageId = defaultWhStorageIdx >= 0 ? storages[defaultWhStorageIdx].whStorageId : null;
                    wh.receivingWhStorageId = receivingWhStorageIdx >= 0 ? storages[receivingWhStorageIdx].whStorageId : null;
                    wh.pickingWhStorageId = pickingWhStorageIdx >= 0 ? storages[pickingWhStorageIdx].whStorageId : null;
                    wh.packingWhStorageId = packingWhStorageIdx >= 0 ? storages[packingWhStorageIdx].whStorageId : null;
                    wh.shippingWhStorageId = shippingWhStorageIdx >= 0 ? storages[shippingWhStorageIdx].whStorageId : null;
                    return wh;
                }))
                this.flush();
                resolve(res)
            } catch(e) {
                console.log(e)
                reject(e)
            }
        })
    }

}
