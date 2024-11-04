import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_APIV_PROVIDER } from './doc-apiv.provider';
import { DocApivTestService } from './doc-apiv-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('DOC_APIV', () => {
    let poolService: PostgresPoolService;
    let docApivTestService: DocApivTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...DOC_APIV_PROVIDER,
                DocApivTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docApivTestService = app.get<DocApivTestService>(DocApivTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_APIV <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});