import { Test } from '@nestjs/testing';
import { RedisSequenceService } from '@bc365-server/common/services/redis-sequence.service';
import { RedisLockService } from '@bc365-server/common/services/redis-lock.service';
import { PostgresPoolService } from '@bc365-server/common/services/postgres-pool.service';
import { PROP_UNIT_FACILITY_PROVIDER } from './prop-unit-facility.provider';
import { PropUnitFacilityTestService } from './prop-unit-facility-test.service'
import { BIZ_PROVIDER } from '../biz';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@bc365-server/common/config/config-schema'

const Joi = require('joi');

jest.setTimeout(5000000);

describe('PROP_UNIT_FACILITY', () => {
    let poolService: PostgresPoolService;
    let propUnitFacilityTestService: PropUnitFacilityTestService

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'q8e4GqhJJDKM7SthdkxxEA';

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
				ConfigModule.forRoot({
					envFilePath: ['.test.env'],
					isGlobal: true,
					validationSchema: Joi.object(configSchema)
				}),
			],
            providers: [
                RedisLockService,
                RedisSequenceService,
                PostgresPoolService,
				...BIZ_PROVIDER,
                ...PROP_UNIT_FACILITY_PROVIDER,
                PropUnitFacilityTestService
            ],
        }).compile();

        poolService = app.get<PostgresPoolService>(PostgresPoolService)
        propUnitFacilityTestService = app.get<PropUnitFacilityTestService>(PropUnitFacilityTestService);

    });

    afterAll(async () => {
        await poolService?.disconnectAll();
    })


    describe('PROP_UNIT_FACILITY <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            expect(true).toBe(true)
        })
    })

});