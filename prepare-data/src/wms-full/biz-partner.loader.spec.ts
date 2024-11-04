import { testDS } from '@bc365-server/common';
import { TenantModule } from '@bc365-server/demo1';
import { RedisSequenceService, RedisLockService } from '@bc365-server/shared';
import { Test } from '@nestjs/testing';
import { entities } from 'libs/demo1/src/lib/generated/orm/entities';

import { BizExtService, BIZ_PROVIDER } from 'libs/demo1/src/lib/generated/services/biz'

// Business Partner
import { CustExtService, CUST_PROVIDER } from 'libs/demo1/src/lib/generated/services/cust'
import { SuppExtService, SUPP_PROVIDER } from 'libs/demo1/src/lib/generated/services/supp'
import { betterSqliteConfig } from 'libs/demo1/src/lib/tenant/orm-config.better-sqlite';


const short = require('short-uuid');

describe('Test Dataloader', () => {

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'ss';
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
                await custExtService.add(bid, brid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
        it('Supp Partner', async () => {
            try {
                const items = require('./test-data/supp.json')
                await suppExtService.add(bid, brid, items) 
            } catch(e) {
                console.log(e);
            }
            expect(true).toBe(true);
        })
    })
})