import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_ARIV_PROVIDER } from './doc-ariv.provider';
import { DocArivTestService } from './doc-ariv-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DOC_ARIV', () => {
    let poolService: PostgresPoolService;
    let docArivTestService: DocArivTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...DOC_ARIV_PROVIDER,
                DocArivTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docArivTestService = app.get<DocArivTestService>(DocArivTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_ARIV <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});