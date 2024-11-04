import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_NAR_ITEM_PROVIDER } from './doc-nar-item.provider';
import { DocNarItemTestService } from './doc-nar-item-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DOC_NAR_ITEM', () => {
    let poolService: PostgresPoolService;
    let docNarItemTestService: DocNarItemTestService

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
                DocNarItemTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docNarItemTestService = app.get<DocNarItemTestService>(DocNarItemTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_NAR_ITEM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});