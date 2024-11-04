import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { REF_DOC_PROVIDER } from './ref-doc.provider';
import { RefDocTestService } from './ref-doc-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('REF_DOC', () => {
    let poolService: PostgresPoolService;
    let refDocTestService: RefDocTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...REF_DOC_PROVIDER,
                RefDocTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        refDocTestService = app.get<RefDocTestService>(RefDocTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('REF_DOC <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});