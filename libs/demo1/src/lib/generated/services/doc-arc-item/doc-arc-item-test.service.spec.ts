import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_ARC_ITEM_PROVIDER } from './doc-arc-item.provider';
import { DocArcItemTestService } from './doc-arc-item-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';

jest.setTimeout(5000000);

describe('DOC_ARC_ITEM', () => {
    let poolService: PostgresPoolService;
    let docArcItemTestService: DocArcItemTestService

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
                ...DOC_ARC_ITEM_PROVIDER,
                DocArcItemTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docArcItemTestService = app.get<DocArcItemTestService>(DocArcItemTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_ARC_ITEM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});