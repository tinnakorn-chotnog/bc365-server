import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_TYPE_PROVIDER } from './pd-type.provider';
import { PdTypeTestService } from './pd-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';

jest.setTimeout(5000000);

describe('PD_TYPE', () => {
    let poolService: PostgresPoolService;
    let pdTypeTestService: PdTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_PROVIDER,
                ...PD_TYPE_PROVIDER,
                PdTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdTypeTestService = app.get<PdTypeTestService>(PdTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});