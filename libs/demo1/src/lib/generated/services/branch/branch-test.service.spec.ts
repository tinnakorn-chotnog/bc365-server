import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { BRANCH_PROVIDER } from './branch.provider';
import { BranchTestService } from './branch-test.service'
import { BIZ_PROVIDER } from '../biz';
import { POS_DEVICE_PROVIDER } from '../pos-device';
import { DOC_POS_PROVIDER } from '../doc-pos';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { DOC_APIV_PROVIDER } from '../doc-apiv';
import { DOC_ARIV_PROVIDER } from '../doc-ariv';
import { DOC_GIN_PROVIDER } from '../doc-gin';
import { DOC_GRN_PROVIDER } from '../doc-grn';
import { DOC_IVA_PROVIDER } from '../doc-iva';
import { DOC_PO_PROVIDER } from '../doc-po';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item'a;
import { DOC_SHIP_PROVIDER } from '../doc-ship';
import { DOC_SO_PROVIDER } from '../doc-so';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_BRANCH_PROVIDER } from '../pd-branch';
import { ASSET_BRANCH_PROVIDER } from '../asset-branch';
import { DOC_NAR_PROVIDER } from '../doc-nar';
import { ASSET_STORAGE_PROVIDER } from '../asset-storage';
import { DOC_ARR_PROVIDER } from '../doc-arr';
import { DOC_NAR_ITEM_PROVIDER } from '../doc-nar-item';
import { DOC_CDJ_PROVIDER } from '../doc-cdj';
import { DOC_CRJ_PROVIDER } from '../doc-crj';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';
import { DOC_RECEIPT_PROVIDER } from '../doc-receipt';
import { WH_PROVIDER } from '../wh';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { PD_CUST_STORAGE_PROVIDER } from '../pd-cust-storage';
import { PD_SUPP_STORAGE_PROVIDER } from '../pd-supp-storage';
import { INV_TRN_PROVIDER } from '../inv-trn';
import { DOC_ARC_PROVIDER } from '../doc-arc';
import { ASSET_WH_PROVIDER } from '../asset-wh';
import { WH_ZONE_PROVIDER } from '../wh-zone';
import { WH_AISLE_PROVIDER } from '../wh-aisle';
import { WH_RACK_PROVIDER } from '../wh-rack';
import { WH_SHELF_PROVIDER } from '../wh-shelf';
import { WH_STAFF_PROVIDER } from '../wh-staff';
import { WH_EQM_PROVIDER } from '../wh-eqm';
import { DOC_DSO_PROVIDER } from '../doc-dso';
import { NEIGHBOURHOOD_PROVIDER } from '../neighbourhood';
import { WH_SU_PROVIDER } from '../wh-su';
import { WH_HU_PROVIDER } from '../wh-hu';
import { DOC_PICK_PROVIDER } from '../doc-pick';
import { DOC_PACK_SU_PROVIDER } from '../doc-pack-su';
import { DOC_TASK_PROVIDER } from '../doc-task';
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { DOC_TFO_PROVIDER } from '../doc-tfo';
import { DOC_TFR_PROVIDER } from '../doc-tfr';
import { DOC_PFFM_PROVIDER } from '../doc-pffm';
import { SDAL_PROVIDER } from '../sdal';
import { DOC_ORESV_PROVIDER } from '../doc-oresv';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('BRANCH', () => {
    let poolService: PostgresPoolService;
    let branchTestService: BranchTestService

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
				...POS_DEVICE_PROVIDER,
				...DOC_POS_PROVIDER,
				...PD_STORAGE_PROVIDER,
				...DOC_APIV_PROVIDER,
				...DOC_ARIV_PROVIDER,
				...DOC_GIN_PROVIDER,
				...DOC_GRN_PROVIDER,
				...DOC_IVA_PROVIDER,
				...DOC_PO_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...DOC_SHIP_PROVIDER,
				...DOC_SO_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...PD_BRANCH_PROVIDER,
				...ASSET_BRANCH_PROVIDER,
				...DOC_NAR_PROVIDER,
				...ASSET_STORAGE_PROVIDER,
				...DOC_ARR_PROVIDER,
				...DOC_NAR_ITEM_PROVIDER,
				...DOC_CDJ_PROVIDER,
				...DOC_CRJ_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
				...DOC_RECEIPT_PROVIDER,
				...WH_PROVIDER,
				...PD_WH_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...PD_CUST_STORAGE_PROVIDER,
				...PD_SUPP_STORAGE_PROVIDER,
				...INV_TRN_PROVIDER,
				...DOC_ARC_PROVIDER,
				...ASSET_WH_PROVIDER,
				...WH_ZONE_PROVIDER,
				...WH_AISLE_PROVIDER,
				...WH_RACK_PROVIDER,
				...WH_SHELF_PROVIDER,
				...WH_STAFF_PROVIDER,
				...WH_EQM_PROVIDER,
				...DOC_DSO_PROVIDER,
				...NEIGHBOURHOOD_PROVIDER,
				...WH_SU_PROVIDER,
				...WH_HU_PROVIDER,
				...DOC_PICK_PROVIDER,
				...DOC_PACK_SU_PROVIDER,
				...DOC_TASK_PROVIDER,
				...RPN_PLAN_PROVIDER,
				...DOC_TFO_PROVIDER,
				...DOC_TFR_PROVIDER,
				...DOC_PFFM_PROVIDER,
				...SDAL_PROVIDER,
				...DOC_ORESV_PROVIDER,
                ...BRANCH_PROVIDER,
                BranchTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        branchTestService = app.get<BranchTestService>(BranchTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('BRANCH <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});