import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { STATUS_PROVIDER } from './status.provider';
import { StatusTestService } from './status-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('STATUS', () => {
    let poolService: PostgresPoolService;
    let statusTestService: StatusTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...STATUS_PROVIDER,
                StatusTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        statusTestService = app.get<StatusTestService>(StatusTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('STATUS <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});