import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_SU_PROVIDER } from './wh-su.provider';
import { WhSuTestService } from './wh-su-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import shortUUID from 'short-uuid';
import { WH_PROVIDER } from '../wh/wh.provider';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdStorage } from '../../interfaces/pd-storage.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { Pd } from '../../interfaces/pd.model';
import { WhAisle } from '../../interfaces/wh-aisle.model';
import { WhRack } from '../../interfaces/wh-rack.model';
import { WhShelf } from '../../interfaces/wh-shelf.model';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WhZone } from '../../interfaces/wh-zone.model';
import { Wh } from '../../interfaces/wh.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PD_PROVIDER, PdExtService } from '../pd';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { WhExtService } from '../wh/wh-ext.service';
import { PD_SU_PROVIDER, PdSuExtService } from '../pd-su';
import { WhSu } from '../../interfaces/wh-su.model';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { WhSuService } from './wh-su.service';
import { PdSu } from '../../interfaces/pd-su.model';
import { groupBy } from 'lodash';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('WH_SU', () => {
    let poolService: PostgresPoolService;
    let whSuTestService: WhSuTestService

    let bid: string;
    let brid: string;

    let bizService: BizExtService;
    let branchService: BranchExtService;
    let whService: WhExtService;
    let whZoneService: WhZoneExtService;
    let whAisleService: WhAisleExtService;
    let whRackService: WhRackExtService;
    let whShelfService: WhShelfExtService;
    let whStorageService: WhStorageExtService;
    let pdService: PdExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let pdSuService: PdSuExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _whs: Wh[];
    let _wh: Wh;
    let _whZone: WhZone;
    let _whAisle: WhAisle;
    let _whRack: WhRack;
    let _whShelf: WhShelf;
    let _whStorage: WhStorage;
    let _whSus: WhSu[];
    let _whSu: WhSu;
    let _srcWhStorage: WhStorage;
    let _dstWhStorage: WhStorage;
    let _whZones: WhZone[];
    let _whAisles: WhAisle[];
    let _whRacks: WhRack[];
    let _whShelves: WhShelf[];
    let _whStorages: WhStorage[];
    let _pds: Pd[];
    let _pd: Pd;
    let _pdBranch: PdBranch;
    let _pdWh: PdWh;
    let _pdStorage: PdStorage;
    let _pdStorages: PdStorage[];
    let _srcSu: WhSu;
    let _dstSu: WhSu;

    beforeAll(async () => {

        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...BRANCH_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_SU_PROVIDER,
                ...WH_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...WH_ZONE_PROVIDER,
                ...WH_AISLE_PROVIDER,
                ...WH_RACK_PROVIDER,
                ...WH_SHELF_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...WH_SU_PROVIDER,
                WhSuTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whSuTestService = app.get<WhSuTestService>(WhSuTestService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whZoneService = app.get<WhZoneExtService>(WhZoneExtService);
        whAisleService = app.get<WhAisleExtService>(WhAisleExtService);
        whRackService = app.get<WhRackExtService>(WhRackExtService);
        whShelfService = app.get<WhShelfExtService>(WhShelfExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        pdSuService = app.get<PdSuExtService>(PdSuExtService)

        _biz = {
            bizId: whSuTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: whSuTestService.service.generateId(),
        }

        _whs = [
            {
                whId: whSuTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                whId: whSuTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            },
            {
                whId: whSuTestService.service.generateId(),
                whNo: 'WH-03',
                whName: 'WH-NAME-03',
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
        ]

        _wh = _whs[0];

        _whZones = [];
        _whAisles = [];
        _whRacks = [];
        _whShelves = [];
        _whStorages = [];
        _pds = [];
        _pdStorages = [];

        // Suppose there 2 warehouse for testing and each warehouse consists of
        // 3-zone
        //   each zone has one aisle
        //      each aisle hasone rack
        //          each rack has one shelf
        //              each shelf has three storages
        // summary
        //  one-shelf has 3 storages
        //  one-rack has 3 storages because one-shelf-one-rack
        //  one-aisle has 3 storages because one-rack-one-aisle
        //  one-zone has 3 storages because one-aisle-one-zone
        //  one-warehouse has 9 storages because one-warehouse-three-zone

        let pdIdx = 1;
        _whs.forEach(wh => {
            ['01', '02', '03'].forEach(sufix => {
                // Zone
                const whZone: WhZone = {
                    whZoneId: whSuTestService.service.generateId(),
                    whZoneNo: sufix,
                    whZoneName: 'ZONE-' + sufix,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                    whId: wh.whId
                }
                _whZones.push(whZone);
                // One Aisle one rack
                const whAisle: WhAisle = {
                    whAisleId: whSuTestService.service.generateId(),
                    whAisleNo: whZone.whZoneNo + 'A1',
                    whAisleName: whZone.whZoneName + '-AISLE1',
                    whId: wh.whId,
                    whZoneId: whZone.whZoneId,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                }
                _whAisles.push(whAisle)
                // Rack
                const whRack: WhRack = {
                    whRackId: whSuTestService.service.generateId(),
                    whRackNo: whAisle.whAisleNo + 'R1',
                    whRackName: whAisle.whAisleName + '-R1',
                    whId: wh.whId,
                    whZoneId: whAisle.whZoneId,
                    whAisleId: whAisle.whAisleId,
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                }
                _whRacks.push(whRack)
                // Shelf
                const whShelf: WhShelf = {
                    whShelfId: whSuTestService.service.generateId(),
                    whShelfNo: whRack.whRackNo + 'S1',
                    whShelfName: whRack.whRackName + '-S1',
                    bizId: _biz.bizId,
                    branchId: _branch.branchId,
                    whId: wh.whId,
                    whRackId: whRack.whRackId,
                    whAisleId: whRack.whAisleId,
                    whZoneId: whRack.whZoneId,
                }

                _whShelves.push(whShelf);

                // Storage
                ['1', '2', '3'].forEach(l => {

                    const whStorage: WhStorage = {
                        whStorageId: whSuTestService.service.generateId(),
                        whId: wh.whId,
                        storageNo: whShelf.whShelfNo + l,
                        storageName: whShelf.whShelfName + '-BIN' + l,
                        whZoneId: whShelf.whZoneId,
                        whAisleId: whShelf.whAisleId,
                        whRackId: whShelf.whRackId,
                        whShelfId: whShelf.whShelfId,
                        bizId: _biz.bizId,
                        branchId: _branch.branchId
                    }

                    _whStorages.push(whStorage);

                })
            })
        })

        _whStorage = _whStorages[0]

        _whSus = [];

        _whs.forEach( wh => {
            ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10'].forEach( s => {
                const whSu: WhSu = {
                    whSuId: whSuTestService.service.generateId(),
                    suNo: wh.whNo + '-' + s,
                    whId: wh.whId
                }
                _whSus.push(whSu);
            })
        })

        bid = _biz.bizId;
        brid = _branch.branchId;

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _whs = await whService.addList({ bid, brid, data: _whs, batch: true })
        _whZones = await whZoneService.addList({ bid, brid, data: _whZones, batch: true })
        _whAisles = await whAisleService.addList({ bid, brid, data: _whAisles, batch: true })
        _whRacks = await whRackService.addList({ bid, brid, data: _whRacks, batch: true })
        _whShelves = await whShelfService.addList({ bid, brid, data: _whShelves, batch: true })
        _whStorages = await whStorageService.addList({ bid, brid, data: _whStorages, batch: true })
        _whSus = [];

        _whSu = {
            whSuId: whSuTestService.service.generateId(),
            suNo: 'SU-01',
            whId: _wh.whId,
        }

        _srcSu = {
            whSuId: whSuTestService.service.generateId(),
            suNo: 'SRC-SU-01',
            whId: _wh.whId
        }

        _dstSu = {
            whSuId: whSuTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId
        }

        _whSus.push(_whSu, _srcSu, _dstSu)

        _pd = {
            pdId: whSuTestService.service.generateId(),
            pdNo: 'PD-0001',
            pdName: 'PD-NAME-0001',
            ohQty: 0,
            allocatedQty: 0,
            useLot: false,
            bizId: _biz.bizId,
        }

        _pdBranch = {
            pdBranchId: whSuTestService.service.generateId(),
            pdId: _pd.pdId,
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdWh = {
            pdWhId: whSuTestService.service.generateId(),
            pdId: _pd.pdId,
            whId: _wh.whId,
            ohQty: 0,
            allocatedQty: 0,
            pdBranchId: _pdBranch.pdBranchId,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        _pdStorages = _whStorages.map( s => {
            const o: PdStorage = {
                pdStorageId: whSuTestService.service.generateId(),
                pdId: _pd.pdId,
                whStorageId: s.whStorageId,
                whShelfId: s.whShelfId,
                whRackId: s.whRackId,
                whAisleId: s.whAisleId,
                whZoneId: s.whZoneId,
                ohQty: 10,
                allocatedQty: 0,
                bizId: _biz.bizId,
                branchId: _branch.branchId
            }
            return o;
        })

        _pdStorage = {
            pdStorageId: whSuTestService.service.generateId(),
            pdId: _pd.pdId,
            whStorageId: _whStorage.whStorageId,
            ohQty: 0,
            allocatedQty: 0,
            bizId: _biz.bizId,
            branchId: _branch.branchId
        }

        bid = _biz.bizId;
        brid = _branch.branchId;

        _biz = await bizService.add({ bid, brid, data: _biz })
        _branch = await branchService.add({ bid, brid, data: _branch })
        _wh = await whService.add({ bid, brid, data: _wh })
        _whZones = await whZoneService.addList({ bid, brid, data: _whZones, batch: true })
        _whAisles = await whAisleService.addList({ bid, brid, data: _whAisles, batch: true })
        _whRacks = await whRackService.addList({ bid, brid, data: _whRacks, batch: true })
        _whShelves = await whShelfService.addList({ bid, brid, data: _whShelves, batch: true })
        _whStorages = await whStorageService.addList({ bid, brid, data: _whStorages, batch: true })
        _pd = await pdService.add({ bid, brid, data: _pd })
        _pdBranch = await pdBranchService.add({ bid, brid, data: _pdBranch })
        _pdWh = await pdWhService.add({ bid, brid, data: _pdWh })
        _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })
        _whSus = await whSuTestService.addList({ bid, brid, data: _whSus, batch: true})

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })

    describe('WH_SU <test case group description>', () => {
        it('#1.1 Before insert', async () => {
            const whSu = await whSuTestService.beforeInsert({ bid, brid, data: _srcSu })
            expect(whSu).toEqual({
                whSuId: whSu.whSuId,
                suNo: _srcSu.suNo,
                whId: _srcSu.whId,
                bizId: bid,
                branchId: brid
            })
        })
        it('#1.1 Before insert with storage', async () => {
            const whSu = await whSuTestService.beforeInsert({ bid, brid, data:{ ..._srcSu, whStorageId: _whStorage.whStorageId  } })
            expect(whSu).toEqual({
                whSuId: _srcSu.whSuId,
                suNo: _srcSu.suNo,
                whAisleId: _whStorage.whAisleId,
                whId: _whStorage.whId,
                whRackId: _whStorage.whRackId,
                whShelfId: _whStorage.whShelfId,
                whStorageId: _whStorage.whStorageId,
                whZoneId: _whStorage.whZoneId,
                bizId: bid,
                branchId: brid
            })
        })
        it('#1.1 Before Insert child', async () => {
            let parentStorage: WhStorage = _whStorages[0]
            let parentWhSu: WhSu = {
                whSuId: whSuTestService.service.generateId(),
                whId: _wh.whId,
                whStorageId: parentStorage.whStorageId,
                suNo: 'P1'
            }
            parentWhSu = await whSuTestService.add({ bid, brid, data: parentWhSu })
            console.log(parentWhSu)
            let whSuChildren: WhSu[] = [
                { whSuId: whSuTestService.service.generateId(), whId: _wh.whId, suNo: 'C1', parentId: parentWhSu.whSuId },
                { whSuId: whSuTestService.service.generateId(), whId: _wh.whId, suNo: 'C2', parentId: parentWhSu.whSuId },
                { whSuId: whSuTestService.service.generateId(), whId: _wh.whId, suNo: 'C3', parentId: parentWhSu.whSuId },
                { whSuId: whSuTestService.service.generateId(), whId: _wh.whId, suNo: 'C4', parentId: parentWhSu.whSuId },
            ]
            let whSu = await whSuTestService.beforeInsert({ bid, brid, data: whSuChildren[0] })
            console.log(whSu)
        })
        it('#1.1 Before update', async () => {
            const whSu = await whSuTestService.beforeUpdate({ bid, brid, data: _srcSu })
            expect(whSu).toEqual({
                whSuId: whSu.whSuId,
                suNo: _srcSu.suNo,
                whId: _srcSu.whId,
                bizId: bid,
                branchId: brid
            })
        })
        it('#1.1 Before update with storage', async () => {
            const whSu = await whSuTestService.beforeUpdate({ bid, brid, data:{ ..._srcSu, whStorageId: _whStorage.whStorageId  } })
            expect(whSu).toEqual({
                whSuId: _srcSu.whSuId,
                suNo: _srcSu.suNo,
                whAisleId: _whStorage.whAisleId,
                whId: _whStorage.whId,
                whRackId: _whStorage.whRackId,
                whShelfId: _whStorage.whShelfId,
                whStorageId: _whStorage.whStorageId,
                whZoneId: _whStorage.whZoneId,
                bizId: bid,
                branchId: brid
            })

        })
        describe('#1.1 Park at new wh', () => {
            let _newPd: Pd;
            let _newPdBranch: PdBranch;
            let _srcWh: Wh;
            let _dstWh: Wh;
            let _newSrcPdWh: PdWh;
            let _newDstPdWh: PdWh;
            let _srcWhStorage: WhStorage;
            let _dstWhStorage: WhStorage;
            let _srcPdStorage: PdStorage;
            let _dstPdStorage: PdStorage;
            beforeAll( async () => {
                _newPd = {
                    pdId: whSuTestService.service.generateId(),
                    pdNo: 'P1',
                    pdName: 'P1 NAME'
                }
                _newPd = await pdService.add({ bid, brid, data: _newPd })

                _newPdBranch = {
                    pdBranchId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    branchId: brid,
                    ohQty: 300
                }
                _newPdBranch = await pdBranchService.add({ bid, brid, data: _newPdBranch })

                _srcWh = _whs[0];
                _dstWh = _whs[1]

                // quantity 100 from storage 100 from su with unspecified storage
                _newSrcPdWh = {
                    pdWhId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    whId: _srcWh.whId,
                    ohQty: 200
                }
                _newSrcPdWh = await pdWhService.add({ bid, brid, data: _newSrcPdWh })

                // quantity 100 from storage only
                _newDstPdWh = {
                    pdWhId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    whId: _dstWh.whId,
                    ohQty: 100
                }
                _newDstPdWh = await pdWhService.add({ bid, brid, data: _newDstPdWh })

                const _whStorageMap = groupBy(_whStorages, 'whId')
                const _srcWhStorages = _whStorageMap[_srcWh.whId]
                const _dstWhStorages = _whStorageMap[_dstWh.whId]

                _srcWhStorage = _srcWhStorages[0]
                _dstWhStorage = _dstWhStorages[0]

                _srcPdStorage = {
                    pdStorageId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    whStorageId: _srcWhStorage.whStorageId,
                    ohQty: 100
                }
                _srcPdStorage = await pdStorageService.add({ bid, brid, data: _srcPdStorage })

                _dstPdStorage = {
                    pdStorageId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    whStorageId: _dstWhStorage.whStorageId,
                    ohQty: 100
                }
                _dstPdStorage = await pdStorageService.add({ bid, brid, data: _dstPdStorage })
            })
            it('#1.1 With storage undefined', async () => {
                //
                let _newWhSu: WhSu = {
                    whSuId: whSuTestService.service.generateId(),
                    suNo: 'SU1',
                    whId: _srcWh.whId,
                }
                _newWhSu = await whSuTestService.add({ bid, brid, data: _newWhSu})

                let _newPdSu: PdSu = {
                    pdSuId: whSuTestService.service.generateId(),
                    pdId: _newPd.pdId,
                    whSuId: _newWhSu.whSuId,
                    ohQty: 100
                }
                _newPdSu = await pdSuService.add({ bid, brid, data: _newPdSu })

                const res = await whSuTestService.setParkStorage({bid, brid, whSuId: _newWhSu.whSuId, whId: _dstWh.whId});

                console.log(res)

            })

        })
    })

});