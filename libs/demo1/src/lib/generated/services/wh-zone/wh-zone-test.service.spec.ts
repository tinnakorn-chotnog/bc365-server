import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { WH_ZONE_PROVIDER } from './wh-zone.provider';
import { WhZoneTestService } from './wh-zone-test.service'
import { BIZ_PROVIDER } from '../biz';
import { WH_STORAGE_PROVIDER } from '../wh-storage';
import { WH_AISLE_PROVIDER } from '../wh-aisle';
import { PD_STORAGE_PROVIDER } from '../pd-storage';
import { PD_LOT_STORAGE_PROVIDER } from '../pd-lot-storage';
import { DOC_PL_ROUTE_PROVIDER } from '../doc-pl-route';
import { DOC_PL_WO_PROVIDER } from '../doc-pl-wo';
import { DOC_PL_PSTORAGE_PROVIDER } from '../doc-pl-pstorage';
import { PD_WH_PROVIDER } from '../pd-wh';
import { DOC_PL_PD_PROVIDER } from '../doc-pl-pd';
import { WH_RACK_PROVIDER } from '../wh-rack';
import { WH_SHELF_PROVIDER } from '../wh-shelf';
import { WH_HU_PROVIDER } from '../wh-hu';
import { WH_SU_PROVIDER } from '../wh-su';

jest.setTimeout(5000000);

describe('WH_ZONE', () => {
    let poolService: PostgresPoolService;
    let whZoneTestService: WhZoneTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...WH_STORAGE_PROVIDER,
				...WH_AISLE_PROVIDER,
				...PD_STORAGE_PROVIDER,
				...PD_LOT_STORAGE_PROVIDER,
				...DOC_PL_ROUTE_PROVIDER,
				...DOC_PL_WO_PROVIDER,
				...DOC_PL_PSTORAGE_PROVIDER,
				...PD_WH_PROVIDER,
				...DOC_PL_PD_PROVIDER,
				...WH_RACK_PROVIDER,
				...WH_SHELF_PROVIDER,
				...WH_HU_PROVIDER,
				...WH_SU_PROVIDER,
                ...WH_ZONE_PROVIDER,
                WhZoneTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        whZoneTestService = app.get<WhZoneTestService>(WhZoneTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('WH_ZONE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});