import { Test } from '@nestjs/testing';
import { RedisLockService, RedisSequenceService } from '../../../../../../../libs/shared/src';
import { TenantModule, testDS } from '../../tenant/tenant.module'
import { entities } from '../../generated/orm/entities';
import { betterSqliteConfig } from '../../tenant/orm-config.better-sqlite';

import { BizExtService, BIZ_PROVIDER } from 'apps/demo1/common/src/app/generated/services/biz'

// Business Partner
import { CustExtService, CUST_PROVIDER } from 'apps/demo1/common/src/app/generated/services/cust'
import { SuppExtService, SUPP_PROVIDER } from 'apps/demo1/common/src/app/generated/services/supp'


const short = require('short-uuid');

describe('Test Dataloader', () => {

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    // const bid = 't7W3ZqGJDGB46gD2Spy3ui';

    let bizService: BizExtService;
    // Business Partner
    let custExtService: CustExtService;
    let suppExtService: SuppExtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TenantModule,
            ],
            
            providers: [
                RedisSequenceService,
                RedisLockService,
                ...BIZ_PROVIDER,
                ...CUST_PROVIDER,
                ...SUPP_PROVIDER
            ],

        }).compile();

        const ds =  await testDS(betterSqliteConfig(bid, entities))

        bizService = moduleRef.get<BizExtService>(BizExtService)

        // Business Partner
        custExtService = moduleRef.get<CustExtService>(CustExtService)
        suppExtService = moduleRef.get<SuppExtService>(SuppExtService)

    });

    
    describe('Load Country State City', () => {
        it('Cust Partner', async () => {
            try {
                const items = require('./test-data/cust.json')
                await custExtService.add(bid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
        it('Supp Partner', async () => {
            try {
                const items = require('./test-data/supp.json')
                await suppExtService.add(bid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
    })
})