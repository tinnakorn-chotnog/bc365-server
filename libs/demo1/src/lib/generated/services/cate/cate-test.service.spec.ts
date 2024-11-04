import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { CATE_PROVIDER } from './cate.provider';
import { CateTestService } from './cate-test.service'
import { BIZ_PROVIDER } from '../biz';
import { SUBCATE_PROVIDER } from '../subcate';
import { PD_PROVIDER } from '../pd';

jest.setTimeout(5000000);

describe('CATE', () => {
    let poolService: PostgresPoolService;
    let cateTestService: CateTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...SUBCATE_PROVIDER,
				...PD_PROVIDER,
                ...CATE_PROVIDER,
                CateTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        cateTestService = app.get<CateTestService>(CateTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('CATE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});