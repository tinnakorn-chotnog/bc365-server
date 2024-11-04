import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_PROVIDER } from './wh.provider';
import { WhTestService } from './wh-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_WH_PROVIDER } from '../pd-wh';
import { ASSET_STORAGE_PROVIDER } from '../asset-storage';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { DOC_GRN_PROVIDER } from '../doc-grn';
import { DOC_GIN_PROVIDER } from '../doc-gin';
import { DOC_IVA_PROVIDER } from '../doc-iva';
import { PD_CUST_STORAGE_PROVIDER } from '../pd-cust-storage';
import { PD_SUPP_STORAGE_PROVIDER } from '../pd-supp-storage';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { ASSET_PROVIDER } from '../asset';
import { DOC_SHIP_PROVIDER } from '../doc-ship';
import { DOC_POS_PROVIDER } from '../doc-pos';
import { ASSET_WH_PROVIDER } from '../asset-wh';
import { DOC_ARC_PROVIDER } from '../doc-arc';
import { DOC_ARR_PROVIDER } from '../doc-arr';
import { DOC_PO_PROVIDER } from '../doc-po';
import { DOC_SO_PROVIDER } from '../doc-so';
import { WH_ZONE_PROVIDER } from '../wh-zone';
import { WH_AISLE_PROVIDER } from '../wh-aisle';
import { WH_RACK_PROVIDER } from '../wh-rack';
import { NEIGHBOURHOOD_PROVIDER } from '../neighbourhood';
import { WH_STAFF_PROVIDER } from '../wh-staff';
import { WH_EQM_PROVIDER } from '../wh-eqm';
import { WH_SHELF_PROVIDER } from '../wh-shelf';
import { WH_HU_PROVIDER } from '../wh-hu';
import { WH_SU_PROVIDER } from '../wh-su';
import { DOC_PICK_PROVIDER } from '../doc-pick';
import { DOC_TASK_PROVIDER } from '../doc-task';
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { DOC_TFO_PROVIDER } from '../doc-tfo';
import { DOC_TFR_PROVIDER } from '../doc-tfr';
import { DOC_ORESV_PROVIDER } from '../doc-oresv';
import { BRANCH_PROVIDER } from '../branch';
import { PD_BRANCH_PROVIDER } from '../pd-branch';
import { PD_SU_PROVIDER } from '../pd-su';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('WH', () => {
    let poolService: PostgresPoolService;
    let whTestService: WhTestService

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
				...WH_STORAGE_PROVIDER,
				...PD_WH_PROVIDER,
				...ASSET_STORAGE_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...DOC_GRN_PROVIDER,
				...DOC_GIN_PROVIDER,
				...DOC_IVA_PROVIDER,
				...PD_CUST_STORAGE_PROVIDER,
				...PD_SUPP_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
				...ASSET_PROVIDER,
				...DOC_SHIP_PROVIDER,
				...DOC_POS_PROVIDER,
				...ASSET_WH_PROVIDER,
				...DOC_ARC_PROVIDER,
				...DOC_ARR_PROVIDER,
				...DOC_PO_PROVIDER,
				...DOC_SO_PROVIDER,
				...WH_ZONE_PROVIDER,
				...WH_AISLE_PROVIDER,
				...WH_RACK_PROVIDER,
				...NEIGHBOURHOOD_PROVIDER,
				...WH_STAFF_PROVIDER,
				...WH_EQM_PROVIDER,
				...WH_SHELF_PROVIDER,
				...WH_HU_PROVIDER,
				...WH_SU_PROVIDER,
				...DOC_PICK_PROVIDER,
				...DOC_TASK_PROVIDER,
				...RPN_PLAN_PROVIDER,
				...DOC_TFO_PROVIDER,
				...DOC_TFR_PROVIDER,
				...DOC_ORESV_PROVIDER,
				...BRANCH_PROVIDER,
				...PD_BRANCH_PROVIDER,
				...PD_SU_PROVIDER,
                ...WH_PROVIDER,
                WhTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whTestService = app.get<WhTestService>(WhTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});