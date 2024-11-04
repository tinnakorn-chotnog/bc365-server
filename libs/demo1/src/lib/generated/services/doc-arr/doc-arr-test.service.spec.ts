import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_ARR_PROVIDER } from './doc-arr.provider';
import { DocArrTestService } from './doc-arr-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';

jest.setTimeout(5000000);

describe('DOC_ARR', () => {
    let poolService: PostgresPoolService;
    let docArrTestService: DocArrTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
                ...DOC_ARR_PROVIDER,
                DocArrTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docArrTestService = app.get<DocArrTestService>(DocArrTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_ARR <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});