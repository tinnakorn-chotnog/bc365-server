import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_GROUP_PROVIDER } from './pd-group.provider';
import { PdGroupTestService } from './pd-group-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';
import { PD_CATE_PROVIDER } from '../pd-cate';
import { PD_VARIANT_GROUP_PROVIDER } from '../pd-variant-group';

jest.setTimeout(5000000);

describe('PD_GROUP', () => {
    let poolService: PostgresPoolService;
    let pdGroupTestService: PdGroupTestService

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
				...PD_CATE_PROVIDER,
				...PD_VARIANT_GROUP_PROVIDER,
                ...PD_GROUP_PROVIDER,
                PdGroupTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdGroupTestService = app.get<PdGroupTestService>(PdGroupTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_GROUP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});