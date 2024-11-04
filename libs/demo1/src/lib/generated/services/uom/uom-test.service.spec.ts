import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { UOM_PROVIDER } from './uom.provider';
import { UomTestService } from './uom-test.service'
import { BIZ_PROVIDER } from '../biz';
import { PD_PROVIDER } from '../pd';
import { PD_UOM_PROVIDER } from '../pd-uom';
import { ASSET_PROVIDER } from '../asset';
import { DOC_NAR_ITEM_PROVIDER } from '../doc-nar-item';
import { DOC_ARC_ITEM_PROVIDER } from '../doc-arc-item';
import { DOC_ARR_ITEM_PROVIDER } from '../doc-arr-item';
import { PD_CUST_PROVIDER } from '../pd-cust';
import { INV_TRN_PROVIDER } from '../inv-trn';

jest.setTimeout(5000000);

describe('UOM', () => {
    let poolService: PostgresPoolService;
    let uomTestService: UomTestService

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
				...PD_UOM_PROVIDER,
				...ASSET_PROVIDER,
				...DOC_NAR_ITEM_PROVIDER,
				...DOC_ARC_ITEM_PROVIDER,
				...DOC_ARR_ITEM_PROVIDER,
				...PD_CUST_PROVIDER,
				...INV_TRN_PROVIDER,
                ...UOM_PROVIDER,
                UomTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        uomTestService = app.get<UomTestService>(UomTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('UOM <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});