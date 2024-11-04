import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { POS_DEVICE_PROVIDER } from './pos-device.provider';
import { PosDeviceTestService } from './pos-device-test.service'
import { BIZ_PROVIDER } from '../biz';
import { DOC_POS_PROVIDER } from '../doc-pos';

jest.setTimeout(5000000);

describe('POS_DEVICE', () => {
    let poolService: PostgresPoolService;
    let posDeviceTestService: PosDeviceTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
				...DOC_POS_PROVIDER,
                ...POS_DEVICE_PROVIDER,
                PosDeviceTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        posDeviceTestService = app.get<PosDeviceTestService>(PosDeviceTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('POS_DEVICE <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});