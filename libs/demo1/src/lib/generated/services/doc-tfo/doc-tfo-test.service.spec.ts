import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_TFO_PROVIDER } from './doc-tfo.provider';
import { DocTfoTestService } from './doc-tfo-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { RPN_PLAN_PROVIDER } from '../rpn-plan';
import { PD_PROVIDER } from '../pd';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { DOC_PICK_PROVIDER } from '../doc-pick';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_TFO', () => {
    let poolService: PostgresPoolService;
    let docTfoTestService: DocTfoTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';
    const whId = '9uHqwBGVKa8WHAZmrwWtEY';

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
                ...DOC_TFO_PROVIDER,
                ...RPN_PLAN_PROVIDER,
                ...PD_PROVIDER,
                ...PD_WH_PROVIDER,
                ...PD_STORAGE_PROVIDER,
                ...DOC_PICK_PROVIDER,
                DocTfoTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docTfoTestService = app.get<DocTfoTestService>(DocTfoTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_TFO <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            // const res: any = await docTfoTestService.createS2SData(bid, brid, whId);
            expect(true).toBe(true)
        })
    })

});