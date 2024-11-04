import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { DOC_SHIP_PROVIDER } from './doc-ship.provider';
import { DocShipTestService } from './doc-ship-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_ARIV_PROVIDER } from '../doc-ariv';

jest.setTimeout(5000000);

describe('DOC_SHIP', () => {
    let poolService: PostgresPoolService;
    let docShipTestService: DocShipTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_ARIV_PROVIDER,
                ...DOC_SHIP_PROVIDER,
                DocShipTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        docShipTestService = app.get<DocShipTestService>(DocShipTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('DOC_SHIP <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});