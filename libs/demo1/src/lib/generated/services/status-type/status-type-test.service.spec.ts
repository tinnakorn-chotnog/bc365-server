import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { STATUS_TYPE_PROVIDER } from './status-type.provider';
import { StatusTypeTestService } from './status-type-test.service'
import { BIZ_PROVIDER } from '../biz';

jest.setTimeout(5000000);

describe('STATUS_TYPE', () => {
    let poolService: PostgresPoolService;
    let statusTypeTestService: StatusTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...STATUS_TYPE_PROVIDER,
                StatusTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        statusTypeTestService = app.get<StatusTypeTestService>(StatusTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('STATUS_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});