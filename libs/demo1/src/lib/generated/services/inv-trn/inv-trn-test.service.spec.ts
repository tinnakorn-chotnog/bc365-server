import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { INV_TRN_PROVIDER } from './inv-trn.provider';
import { InvTrnTestService } from './inv-trn-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('INV_TRN', () => {
    let poolService: PostgresPoolService;
    let invTrnTestService: InvTrnTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...INV_TRN_PROVIDER,
                InvTrnTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        invTrnTestService = app.get<InvTrnTestService>(InvTrnTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('INV_TRN <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});