import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_RESV_PROVIDER } from './pd-resv.provider';
import { PdResvTestService } from './pd-resv-test.service'
import { BIZ_PROVIDER, BizExtService } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { Biz } from '../../interfaces/biz.model';
import { Branch } from '../../interfaces/branch.model';
import { PdBranch } from '../../interfaces/pd-branch.model';
import { PdStorage } from '../../interfaces/pd-storage.model';
import { PdSu } from '../../interfaces/pd-su.model';
import { PdWh } from '../../interfaces/pd-wh.model';
import { Pd } from '../../interfaces/pd.model';
import { WhAisle } from '../../interfaces/wh-aisle.model';
import { WhRack } from '../../interfaces/wh-rack.model';
import { WhShelf } from '../../interfaces/wh-shelf.model';
import { WhStorage } from '../../interfaces/wh-storage.model';
import { WhSu } from '../../interfaces/wh-su.model';
import { WhZone } from '../../interfaces/wh-zone.model';
import { Wh } from '../../interfaces/wh.model';
import { BRANCH_PROVIDER, BranchExtService } from '../branch';
import { PD_BRANCH_PROVIDER, PdBranchExtService } from '../pd-branch';
import { PD_LOT_PROVIDER, PdLotExtService } from '../pd-lot';
import { PD_LOT_STORAGE_PROVIDER, PdLotStorageExtService } from '../pd-lot-storage';
import { PD_STORAGE_PROVIDER, PdStorageExtService } from '../pd-storage';
import { PD_SU_PROVIDER, PdSuExtService } from '../pd-su';
import { PD_WH_PROVIDER, PdWhExtService } from '../pd-wh';
import { PdExtService } from '../pd/pd-ext.service';
import { WH_PROVIDER, WhExtService } from '../wh';
import { WH_AISLE_PROVIDER, WhAisleExtService } from '../wh-aisle';
import { WH_RACK_PROVIDER, WhRackExtService } from '../wh-rack';
import { WH_SHELF_PROVIDER, WhShelfExtService } from '../wh-shelf';
import { WH_STORAGE_PROVIDER, WhStorageExtService } from '../wh-storage';
import { WH_SU_PROVIDER, WhSuExtService } from '../wh-su';
import { WH_ZONE_PROVIDER, WhZoneExtService } from '../wh-zone';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { PD_PROVIDER } from '../pd/pd.provider';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PD_RESV', () => {
    let poolService: PostgresPoolService;
    let pdResvTestService: PdResvTestService

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
    let whSuService: WhSuExtService;
    let pdService: PdExtService;
    let pdLotService: PdLotExtService;
    let pdLotStorageService: PdLotStorageExtService;
    let pdBranchService: PdBranchExtService;
    let pdWhService: PdWhExtService;
    let pdStorageService: PdStorageExtService;
    let pdSuService: PdSuExtService;

    let _biz: Biz;
    let _branch: Branch;
    let _whs: Wh[];
    let _wh: Wh;
    let _whZones: WhZone[];
    let _whZone: WhZone;
    let _whAisles: WhAisle[];
    let _whAisle: WhAisle;
    let _whRacks: WhRack[];
    let _whRack: WhRack;
    let _whShelves: WhShelf[];
    let _whShelf: WhShelf;
    let _whStorages: WhStorage[];
    let _whStorage: WhStorage;
    let _whSus: WhSu[];
    let _whSu: WhSu;
    let _pds: Pd[];
    let _pd: Pd;
    let _pdBranches: PdBranch[];
    let _pdBranch: PdBranch;
    let _pdWhs: PdWh[];
    let _pdWh: PdWh;
    let _pdStorages: PdStorage[];
    let _pdStorage: PdStorage;
    let _pdSus: PdSu[];
    let _pdSu: PdSu;

    let _srcWhSu: WhSu;
    let _dstWhSu: WhSu;
    let _whSuAtWh: WhSu;
    let _whSuAtStorage: WhSu;

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
                ...WH_PROVIDER,
                ...WH_ZONE_PROVIDER,
                ...WH_AISLE_PROVIDER,
                ...WH_RACK_PROVIDER,
                ...WH_SHELF_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...WH_SU_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_LOT_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
                ...PD_SU_PROVIDER,
                ...PD_RESV_PROVIDER,
                PdResvTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdResvTestService = app.get<PdResvTestService>(PdResvTestService);

        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        bizService = app.get<BizExtService>(BizExtService);
        branchService = app.get<BranchExtService>(BranchExtService);
        whService = app.get<WhExtService>(WhExtService);
        whZoneService = app.get<WhZoneExtService>(WhZoneExtService);
        whAisleService = app.get<WhAisleExtService>(WhAisleExtService);
        whRackService = app.get<WhRackExtService>(WhRackExtService);
        whShelfService = app.get<WhShelfExtService>(WhShelfExtService);
        whStorageService = app.get<WhStorageExtService>(WhStorageExtService);
        whSuService = app.get<WhSuExtService>(WhSuExtService);
        pdService = app.get<PdExtService>(PdExtService);
        pdLotService = app.get<PdLotExtService>(PdLotExtService);
        pdLotStorageService = app.get<PdLotStorageExtService>(PdLotStorageExtService);
        pdBranchService = app.get<PdBranchExtService>(PdBranchExtService);
        pdWhService = app.get<PdWhExtService>(PdWhExtService);
        pdStorageService = app.get<PdStorageExtService>(PdStorageExtService);
        pdSuService = app.get<PdSuExtService>(PdSuExtService)

        _biz = {
            bizId: pdResvTestService.service.generateId(),
            bizNo: 'BIZ-01',
            bizName: 'BIZ-NAME-01'
        }

        _branch = {
            branchId: pdResvTestService.service.generateId(),
        }

        _whs = [
            {
                whId: pdResvTestService.service.generateId(),
                whNo: 'WH-01',
                whName: 'WH-NAME-01',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdResvTestService.service.generateId(),
                whNo: 'WH-02',
                whName: 'WH-NAME-02',
                bizId: bid,
                branchId: brid
            },
            {
                whId: pdResvTestService.service.generateId(),
                whNo: 'WH-03',
                whName: 'WH-NAME-03',
                bizId: bid,
                branchId: brid
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
                    whZoneId: pdResvTestService.service.generateId(),
                    whZoneNo: sufix,
                    whZoneName: 'ZONE-' + sufix,
                    bizId: bid,
                    branchId: brid,
                    whId: wh.whId
                }
                _whZones.push(whZone);
                // One Aisle one rack
                const whAisle: WhAisle = {
                    whAisleId: pdResvTestService.service.generateId(),
                    whAisleNo: whZone.whZoneNo + 'A1',
                    whAisleName: whZone.whZoneName + '-AISLE1',
                    whId: wh.whId,
                    whZoneId: whZone.whZoneId,
                    bizId: bid,
                    branchId: brid
                }
                _whAisles.push(whAisle)
                // Rack
                const whRack: WhRack = {
                    whRackId: pdResvTestService.service.generateId(),
                    whRackNo: whAisle.whAisleNo + 'R1',
                    whRackName: whAisle.whAisleName + '-R1',
                    whId: wh.whId,
                    whZoneId: whAisle.whZoneId,
                    whAisleId: whAisle.whAisleId,
                    bizId: bid,
                    branchId: brid
                }
                _whRacks.push(whRack)
                // Shelf
                const whShelf: WhShelf = {
                    whShelfId: pdResvTestService.service.generateId(),
                    whShelfNo: whRack.whRackNo + 'S1',
                    whShelfName: whRack.whRackName + '-S1',
                    bizId: bid,
                    branchId: brid,
                    whId: wh.whId,
                    whRackId: whRack.whRackId,
                    whAisleId: whRack.whAisleId,
                    whZoneId: whRack.whZoneId,
                }

                _whShelves.push(whShelf);

                // Storage
                ['1', '2', '3'].forEach(l => {

                    const whStorage: WhStorage = {
                        whStorageId: pdResvTestService.service.generateId(),
                        whId: wh.whId,
                        storageNo: whShelf.whShelfNo + l,
                        storageName: whShelf.whShelfName + '-BIN' + l,
                        whZoneId: whShelf.whZoneId,
                        whAisleId: whShelf.whAisleId,
                        whRackId: whShelf.whRackId,
                        whShelfId: whShelf.whShelfId,
                        bizId: bid,
                        branchId: brid
                    }

                    _whStorages.push(whStorage);

                })
            })
        })

        // Defaule from warehouse 0
        _whZone = _whZones[0]
        _whAisle = _whAisles[0]
        _whRack = _whRacks[0]
        _whShelf = _whShelves[0]
        _whStorage = _whStorages[0]

        _whSus = [];

        _whs.forEach( wh => {
            ['T01','T02','T03','T04','T05','T06','T07','T08','T09','T10'].forEach( s => {
                const whSu: WhSu = {
                    whSuId: pdResvTestService.service.generateId(),
                    suNo: wh.whNo + '-' + s,
                    whId: wh.whId
                }
                _whSus.push(whSu);
            })
        })

        bid = _biz.bizId;
        brid = _branch.branchId;

        _whSus = [
            {
                whSuId: pdResvTestService.service.generateId(),
                suNo: 'SU-01',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdResvTestService.service.generateId(),
                suNo: 'SU-02',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdResvTestService.service.generateId(),
                suNo: 'SU-03',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
            {
                whSuId: pdResvTestService.service.generateId(),
                suNo: 'SU-04',
                whId: _wh.whId,
                bizId: bid,
                branchId: brid,
                whStorageId: _whStorage.whStorageId
            },
        ];

        _whSu = _whSus[0]

        _srcWhSu = {
            whSuId: pdResvTestService.service.generateId(),
            suNo: 'SRC-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _dstWhSu = {
            whSuId: pdResvTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _whSuAtWh = {
            whSuId: pdResvTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
        }

        _whSuAtStorage = {
            whSuId: pdResvTestService.service.generateId(),
            suNo: 'DST-SU-01',
            whId: _wh.whId,
            bizId: bid,
            branchId: brid,
            whStorageId: _whStorage.whStorageId
        }

        _whSus.push(_srcWhSu, _dstWhSu, _whSuAtStorage, _whSuAtWh)

        pdIdx = 1;
        _pds = _whStorages.map( ws => {
            const pd: Pd = {
                pdId: pdResvTestService.service.generateId(),
                pdNo: 'P' + pdIdx.toString().padStart(3, '0'),
                pdName: 'P-NAME-' + pdIdx.toString().padStart(3, '0'),
                ohQty: 100,
                allocatedQty: 0,
                useLot: false,
                bizId: bid,
            }
            pdIdx++;
            return pd;
        })

        _pd = _pds[0]

        _pdBranches = [];

        _pds.forEach( pd => {
            const o: PdBranch =  {
                pdBranchId: pdResvTestService.service.generateId(),
                pdId: pd.pdId,
                ohQty: 0,
                allocatedQty: 0,
                bizId: bid,
                branchId: brid
            }
            _pdBranches.push(o)
        })

        _pdBranch = _pdBranches[0]

        _pdWhs = [];

        _pds.forEach( pd => {
            _whs.forEach( wh => {
                const o: PdWh =  {
                    pdWhId: pdResvTestService.service.generateId(),
                    pdId: pd.pdId,
                    whId: wh.whId,
                    ohQty: 0,
                    allocatedQty: 0,
                    pdBranchId: _pdBranch.pdBranchId,
                    bizId: bid,
                    branchId: brid
                }
                _pdWhs.push(o)
            })
        })

        _pdWh = _pdWhs[0]

        _pdStorages = [];
        _pds.forEach( pd => {
            _whStorages.forEach( storage => {
                const o: PdStorage =  {
                    pdStorageId: pdResvTestService.service.generateId(),
                    pdId: pd.pdId,
                    whStorageId: storage.whStorageId,
                    whShelfId: storage.whShelfId,
                    whRackId: storage.whRackId,
                    whAisleId: storage.whAisleId,
                    whZoneId: storage.whZoneId,
                    ohQty: 10,
                    allocatedQty: 0,
                    bizId: bid,
                    branchId: brid
                }
                _pdStorages.push(o)
            })
        })

        _pdStorage = _pdStorages[0]

        _pdSus = [
            { pdSuId: pdResvTestService.service.generateId(), pdId: _pds[0].pdId, whSuId: _whSus[0].whSuId, ohQty: 20, allocatedQty: 0 },
            { pdSuId: pdResvTestService.service.generateId(), pdId: _pds[1].pdId, whSuId: _whSus[1].whSuId, ohQty: 20, allocatedQty: 0 },
            { pdSuId: pdResvTestService.service.generateId(), pdId: _pds[2].pdId, whSuId: _whSus[2].whSuId, ohQty: 20, allocatedQty: 0 },
            { pdSuId: pdResvTestService.service.generateId(), pdId: _pds[3].pdId, whSuId: _whSus[3].whSuId, ohQty: 20, allocatedQty: 0 },
        ];

        _pdSu = _pdSus[0]

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
        _whSus = await whSuService.addList({ bid, brid, data: _whSus, batch: true })
        _pds = await pdService.addList({ bid, brid, data: _pds, batch: true })
        _pdBranches = await pdBranchService.addList({ bid, brid, data: _pdBranches, batch: true })
        _pdWhs = await pdWhService.addList({ bid, brid, data: _pdWhs, batch: true })
        _pdStorages = await pdStorageService.addList({ bid, brid, data: _pdStorages, batch: true })
        _pdSus = await pdSuService.addList({ bid, brid, data: _pdSus, batch: true })

        _pd = _pds[0]
        _pdBranch = _pdBranches.filter( pd => pd.pdId === _pd.pdId && pd.branchId === brid)[0]
        _pdWh = _pdWhs.filter( pd => pd.pdId === _pd.pdId && pd.whId === _wh.whId)[0]
        _pdStorage = _pdStorages.filter( pd => pd.pdId === _pd.pdId && pd.whStorageId === _whStorage.whStorageId)[0]
        _pdSu = _pdSus.filter( pd => pd.pdId === _pd.pdId && pd.whSuId === _whSu.whSuId)[0]

        console.log(_pd, _pdSu)

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_RESV <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});