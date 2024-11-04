import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_NAR_PROVIDER } from './doc-nar.provider';
import { DocNarTestService } from './doc-nar-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_NAR_ITEM_PROVIDER } from '../doc-nar-item';

jest.setTimeout(5000000);

describe('DOC_NAR', () => {
    let poolService: PostgresPoolService;
    let docNarTestService: DocNarTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_NAR_ITEM_PROVIDER,
                ...DOC_NAR_PROVIDER,
                DocNarTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docNarTestService = app.get<DocNarTestService>(DocNarTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_NAR <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});