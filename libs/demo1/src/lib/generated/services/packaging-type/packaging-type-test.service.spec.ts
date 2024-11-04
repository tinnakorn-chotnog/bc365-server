import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PACKAGING_TYPE_PROVIDER } from './packaging-type.provider';
import { PackagingTypeTestService } from './packaging-type-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_UOM_PROVIDER } from '../pd-uom';

jest.setTimeout(5000000);

describe('PACKAGING_TYPE', () => {
    let poolService: PostgresPoolService;
    let packagingTypeTestService: PackagingTypeTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...PD_UOM_PROVIDER,
                ...PACKAGING_TYPE_PROVIDER,
                PackagingTypeTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        packagingTypeTestService = app.get<PackagingTypeTestService>(PackagingTypeTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PACKAGING_TYPE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});