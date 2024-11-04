import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PD_ATTRIBUTE_PROVIDER } from './pd-attribute.provider';
import { PdAttributeTestService } from './pd-attribute-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_VARIANT_GROUP_PROVIDER } from '../pd-variant-group';

jest.setTimeout(5000000);

describe('PD_ATTRIBUTE', () => {
    let poolService: PostgresPoolService;
    let pdAttributeTestService: PdAttributeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_VARIANT_GROUP_PROVIDER,
                ...PD_ATTRIBUTE_PROVIDER,
                PdAttributeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        pdAttributeTestService = app.get<PdAttributeTestService>(PdAttributeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PD_ATTRIBUTE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});