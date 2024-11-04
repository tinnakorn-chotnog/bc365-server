import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { SUPP_GROUP_PROVIDER } from './supp-group.provider';
import { SuppGroupTestService } from './supp-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { SUPP_PROVIDER } from '../supp';

jest.setTimeout(5000000);

describe('SUPP_GROUP', () => {
    let poolService: PostgresPoolService;
    let suppGroupTestService: SuppGroupTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...SUPP_PROVIDER,
                ...SUPP_GROUP_PROVIDER,
                SuppGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        suppGroupTestService = app.get<SuppGroupTestService>(SuppGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('SUPP_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});