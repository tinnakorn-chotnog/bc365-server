import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_PFFM_PROVIDER } from './doc-pffm.provider';
import { DocPffmTestService } from './doc-pffm-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_PICK_PROVIDER } from '../doc-pick';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'
import { PD_PROVIDER } from '../pd';
import { PD_WH_PROVIDER } from '../pd-wh';
import { PD_BRANCH_PROVIDER } from '../pd-branch';

const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_PFFM', () => {
    let poolService: PostgresPoolService;
    let docPffmTestService: DocPffmTestService

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
				...DOC_PICK_PROVIDER,
                ...DOC_PFFM_PROVIDER,
                ...PD_PROVIDER,
                ...PD_BRANCH_PROVIDER,
                ...PD_WH_PROVIDER,
                DocPffmTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docPffmTestService = app.get<DocPffmTestService>(DocPffmTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_PFFM <test case group description>', () => {
        it('#1.1 Check Availability', async () => {
            const res = await docPffmTestService.testBranchException(bid, brid, 'ad9zzJtWKyuqtR8V5pK8wZ');
            console.log(res)
            expect(true).toBe(true)
        })
        it('#1.1 <case description>', async () => {
            const res = await docPffmTestService.createDocPick({ bid, brid, docPickId: 'b4H2g4h3KnwPUa1gqQW13i' });
            console.log(res)
            expect(true).toBe(true)
        })
    })

});