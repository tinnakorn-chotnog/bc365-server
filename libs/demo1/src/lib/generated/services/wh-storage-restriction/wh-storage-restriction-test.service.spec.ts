import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_STORAGE_RESTRICTION_PROVIDER } from './wh-storage-restriction.provider';
import { WhStorageRestrictionTestService } from './wh-storage-restriction-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_SHELF_PROVIDER } from '../wh-shelf';
import { WH_RACK_PROVIDER } from '../wh-rack';
import { WH_ZONE_PROVIDER } from '../wh-zone';
import { WH_AISLE_PROVIDER } from '../wh-aisle';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { WH_STORAGE_TYPE_PROVIDER } from '../wh-storage-type';

jest.setTimeout(5000000);

describe('WH_STORAGE_RESTRICTION', () => {
    let poolService: PostgresPoolService;
    let whStorageRestrictionTestService: WhStorageRestrictionTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_SHELF_PROVIDER,
				...WH_RACK_PROVIDER,
				...WH_ZONE_PROVIDER,
				...WH_AISLE_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...PD_STORAGE_PROVIDER,
				...WH_STORAGE_TYPE_PROVIDER,
                ...WH_STORAGE_RESTRICTION_PROVIDER,
                WhStorageRestrictionTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whStorageRestrictionTestService = app.get<WhStorageRestrictionTestService>(WhStorageRestrictionTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_STORAGE_RESTRICTION <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});