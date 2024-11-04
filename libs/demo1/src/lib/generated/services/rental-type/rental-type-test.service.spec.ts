import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { RENTAL_TYPE_PROVIDER } from './rental-type.provider';
import { RentalTypeTestService } from './rental-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARC_PROVIDER } from '../doc-arc';

jest.setTimeout(5000000);

describe('RENTAL_TYPE', () => {
    let poolService: PostgresPoolService;
    let rentalTypeTestService: RentalTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARC_PROVIDER,
                ...RENTAL_TYPE_PROVIDER,
                RentalTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        rentalTypeTestService = app.get<RentalTypeTestService>(RentalTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('RENTAL_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});