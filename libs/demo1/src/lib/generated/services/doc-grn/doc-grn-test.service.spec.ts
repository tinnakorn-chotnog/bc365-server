import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_GRN_PROVIDER } from './doc-grn.provider';
import { DocGrnTestService } from './doc-grn-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DocGrn } from '../../interfaces/doc-grn.model';
import { PD_UOM_PROVIDER } from '../pd-uom';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_LOT_PROVIDER } from '../pd-lot';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { WH_SU_PROVIDER } from '../wh-su';
import { PD_SU_PROVIDER } from '../pd-su';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_PROVIDER } from '../pd';
import { SUPP_PROVIDER } from '../supp';

jest.setTimeout(5000000);

describe('DOC_GRN', () => {
    let poolService: PostgresPoolService;
    let docGrnTestService: DocGrnTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...DOC_GRN_PROVIDER,
                ...PD_PROVIDER,
                ...PD_UOM_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_LOT_PROVIDER,
                ...PD_LOT_STORAGE_PROVIDER,
                ...PD_SU_PROVIDER,
                ...WH_SU_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                ...SUPP_PROVIDER,
                DocGrnTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docGrnTestService = app.get<DocGrnTestService>(DocGrnTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_GRN <test case group description>', () => {
        it('#1.1 GRN no lot', async () => {
            const docGrn: DocGrn = {
                docGrnId: docGrnTestService.service.generateId(),
                docNo: "0001",
                docDate: new Date().getTime(),
                status: 'R',
                items: [
                    {
                        itemId: docGrnTestService.service.generateId(),
                        pdId: 'iUgggMLiR1xtPnkQzzvAQG',
                        receivedQty: 5,
                        pdUomId: 'nMZKzdkUTq2xQJkMWjxaAv',
                        whStorageId: '6XK1sHJeumqwjXE8tZre9b',
                    }
                ]
            }
            const res = await docGrnTestService.beforeInsert({ bid, brid, data: docGrn });
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.1 GRN with lot', async () => {
            const docGrn: DocGrn = {
                docGrnId: docGrnTestService.service.generateId(),
                docNo: "0001",
                docDate: new Date().getTime(),
                status: 'R',
                items: [
                    {
                        itemId: docGrnTestService.service.generateId(),
                        pdId: 'kQY4BtXQUNsq5FF4p1oP1n',
                        receivedQty: 5,
                        pdUomId: 'o1gJGcXikvDgxqggktbcgP',
                        pdLotId: 'f5ueFrpqaCX6qsS87fgJpa',
                        whStorageId: 'p8zJmCeW7dCoeHhnFDZVdJ',
                    }
                ]
            }
            const res = await docGrnTestService.beforeInsert({ bid, brid, data: docGrn });
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.1 Generate GRN with su', async () => {
            const res = await docGrnTestService.createGrnWithSu(bid, brid)
        })
        it('#1.1 GRN with su', async () => {
            const docGrn: DocGrn = {
                docGrnId: docGrnTestService.service.generateId(),
                docNo: "0001",
                docDate: new Date().getTime(),
                status: 'R',
                items: [
                    {
                        itemId: docGrnTestService.service.generateId(),
                        pdId: 'kQY4BtXQUNsq5FF4p1oP1n',
                        receivedQty: 50,
                        pdUomId: 'o1gJGcXikvDgxqggktbcgP',
                        pdLotId: 'f5ueFrpqaCX6qsS87fgJpa',
                        whStorageId: 'p8zJmCeW7dCoeHhnFDZVdJ',
                        // whStorageId: 'exQJZMLa5W1YeX5V7ERGLa',
                        applySu: true,
                        suReceive: {
                            suTypeId: 'wVpQmsjubFVpzjfxvFLBJH',
                            numOfSu: 5,
                            qtyPerSu: 10,
                            suList: [
                                { suNo: '001-000-P001', receivedQty: 10 },
                                { suNo: '001-000-P002', receivedQty: 10 },
                                { suNo: '001-000-P003', receivedQty: 10 },
                                { suNo: '001-000-P004', receivedQty: 10 },
                                { suNo: '001-000-P005X', receivedQty: 10 },
                            ]
                        }
                    }
                ]
            }
            // const pdStorageGet = jest.spyOn(docGrnTestService.pdStorageService, 'add').mockImplementation( () => null );
            // const whSuGet = jest.spyOn(docGrnTestService.whSuService, 'get').mockImplementation( () => null );
            const res = await docGrnTestService.beforeInsert({ bid, brid, data: docGrn });
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#R.1 GRN receive', async () => {
            const docGrn: DocGrn = await docGrnTestService.getById(bid, { id: '565vF7T9EyaCdtoQcfCcwJ' })
            const res = await docGrnTestService.receive({ bid, brid, docGrn })
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#R.2 GRN receive with lot', async () => {
            const docGrn: DocGrn = await docGrnTestService.getById(bid, { id: 'w3dddzyv6cMD1HoN1qeiPz' })
            console.log(docGrn)
            const res = await docGrnTestService.receive({ bid, brid, docGrn })
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#R.3 GRN receive with su', async () => {
            const docGrn: DocGrn = await docGrnTestService.getById(bid, { id: 'uRkEmGifFcLbXongiufkhN' })
            const res = await docGrnTestService.receive({ bid, brid, docGrn })
            console.log(JSON.stringify(res, null, 2))
            expect(true).toBe(true)
        })
        it('#R.1 Generate GRN', async () => {
            const res1 = await docGrnTestService.createGrn(bid, brid);
            const res2 = await docGrnTestService.createGrnWithLot(bid, brid);
            const res3 = await docGrnTestService.createGrnWithSu(bid, brid);
            console.log(JSON.stringify(res3, null, 2))
        });
    })

});