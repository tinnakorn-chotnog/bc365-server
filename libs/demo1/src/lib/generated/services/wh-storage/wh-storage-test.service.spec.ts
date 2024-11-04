import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_STORAGE_PROVIDER } from './wh-storage.provider';
import { WhStorageTestService } from './wh-storage-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { ASSET_STORAGE_PROVIDER } from '../asset-storage';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { CPD_STORAGE_PROVIDER } from '../cpd-storage';
import { SPD_STORAGE_PROVIDER } from '../spd-storage';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ASSET_PROVIDER } from '../asset';
import { WH_PROVIDER } from '../wh';
import { WH_HU_PROVIDER } from '../wh-hu';
import { WH_SU_PROVIDER } from '../wh-su';
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { PD_HU_PROVIDER } from '../pd-hu';
import { PD_SU_PROVIDER } from '../pd-su';
import { PD_RESV_PROVIDER } from '../pd-resv';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('WH_STORAGE', () => {
    let poolService: PostgresPoolService;
    let whStorageTestService: WhStorageTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

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
				...PD_STORAGE_PROVIDER,
				...ASSET_STORAGE_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...CPD_STORAGE_PROVIDER,
				...SPD_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
				...ASSET_PROVIDER,
				...WH_PROVIDER,
				...WH_HU_PROVIDER,
				...WH_SU_PROVIDER,
				...RPN_PLAN_PROVIDER,
				...PD_HU_PROVIDER,
				...PD_SU_PROVIDER,
				...PD_RESV_PROVIDER,
                ...WH_STORAGE_PROVIDER,
                WhStorageTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whStorageTestService = app.get<WhStorageTestService>(WhStorageTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_STORAGE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            const wh = await whStorageTestService.whService.getById(bid, { id: "dxNxD8gwLPTVsVN3BC6q1j"})
            const whStorages = await whStorageTestService.get({ bid, brid, filter: { whId: "dxNxD8gwLPTVsVN3BC6q1j"}})
            whStorages.forEach( s => {
                s.storageNo = wh.whNo + '-' + s.storageNo
            })
            await whStorageTestService.updateList({ bid, brid, data: whStorages, batch: true})
            await whStorageTestService.flush();
            expect(true).toBe(true)
        })
    })

});