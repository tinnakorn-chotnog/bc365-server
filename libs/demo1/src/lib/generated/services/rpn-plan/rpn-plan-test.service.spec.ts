import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RPN_PLAN_PROVIDER } from './rpn-plan.provider';
import { RpnPlanTestService } from './rpn-plan-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_BRANCH_PROVIDER } from '../pd-branch';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { PD_PROVIDER } from '../pd';
import { BRANCH_PROVIDER } from '../branch';
import { WH_PROVIDER } from '../wh';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('RPN_PLAN', () => {
    let poolService: PostgresPoolService;
    let rpnPlanTestService: RpnPlanTestService

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
                ...BRANCH_PROVIDER,
                ...PD_PROVIDER,
				...PD_WH_PROVIDER,
				...PD_STORAGE_PROVIDER,
				...PD_BRANCH_PROVIDER,
                ...RPN_PLAN_PROVIDER,
                ...WH_PROVIDER,
                RpnPlanTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        rpnPlanTestService = app.get<RpnPlanTestService>(RpnPlanTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RPN_PLAN <test case group description>', () => {
        it('#1.1 Branch replenishment', async () => {
            const res = await rpnPlanTestService.createRpnPlanFromBranch({bid, brid});
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.2 Warehouse replenishment', async () => {
            const res = await rpnPlanTestService.createRpnPlanFromWh({bid, brid});
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.3 Storage replenishment by zone', async () => {
            const res = await rpnPlanTestService.createRpnPlanFromStorage({bid, brid});
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.4 Assign preffered supplier', async () => {
            const res = await rpnPlanTestService.assignPrefferedSupp({bid, brid});
            console.log(res)
            expect(true).toBe(true)
        })
    })

});