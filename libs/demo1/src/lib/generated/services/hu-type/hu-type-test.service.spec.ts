import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { HU_TYPE_PROVIDER } from './hu-type.provider';
import { HuTypeTestService } from './hu-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_HU_PROVIDER } from '../wh-hu';

jest.setTimeout(5000000);

describe('HU_TYPE', () => {
    let poolService: PostgresPoolService;
    let huTypeTestService: HuTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_HU_PROVIDER,
                ...HU_TYPE_PROVIDER,
                HuTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        huTypeTestService = app.get<HuTypeTestService>(HuTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('HU_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});