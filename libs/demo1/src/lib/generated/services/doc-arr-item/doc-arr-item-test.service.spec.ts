import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_ARR_ITEM_PROVIDER } from './doc-arr-item.provider';
import { DocArrItemTestService } from './doc-arr-item-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DOC_ARR_ITEM', () => {
    let poolService: PostgresPoolService;
    let docArrItemTestService: DocArrItemTestService

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
                DocArrItemTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docArrItemTestService = app.get<DocArrItemTestService>(DocArrItemTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_ARR_ITEM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});