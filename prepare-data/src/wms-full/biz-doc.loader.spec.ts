import { Test } from '@nestjs/testing';
import { ALL_PROVIDER } from 'libs/demo1/src/lib/generated/providers'
import { BizExtService } from 'libs/demo1/src/lib/generated/services/biz'
import { DocGinExtService } from 'libs/demo1/src/lib/generated/services/doc-gin'
import { DocGinItemExtService } from 'libs/demo1/src/lib/generated/services/doc-gin-item'
import { DocGrnExtService } from 'libs/demo1/src/lib/generated/services/doc-grn'
import { DocGrnItemExtService } from 'libs/demo1/src/lib/generated/services/doc-grn-item'
import { DocPoExtService } from 'libs/demo1/src/lib/generated/services/doc-po'
import { DocPoItemExtService } from 'libs/demo1/src/lib/generated/services/doc-po-item'
import { DocSoExtService } from 'libs/demo1/src/lib/generated/services/doc-so'
import { DocSoItemExtService } from 'libs/demo1/src/lib/generated/services/doc-so-item'
import { DocPosExtService } from 'libs/demo1/src/lib/generated/services/doc-pos'
import { DocPosItemExtService } from 'libs/demo1/src/lib/generated/services/doc-pos-item'
import { DocShipExtService } from 'libs/demo1/src/lib/generated/services/doc-ship'
import { DocShipItemExtService } from 'libs/demo1/src/lib/generated/services/doc-ship-item'
import { TenantModule } from 'libs/demo1/src/lib/tenant/tenant.module';
import { testDS } from '@bc365-server/common';
import { RedisSequenceService, RedisLockService } from '@bc365-server/shared';
import { entities } from 'libs/demo1/src/lib/generated/orm/entities';
import { betterSqliteConfig } from 'libs/demo1/src/lib/tenant/orm-config.better-sqlite';
const short = require('short-uuid');

describe('Test Dataloader', () => {

    const bid = 'mnuz6SU4ncbMmBrutWioae';
    const brid = 'ss';

    let bizService: BizExtService;
    let docGin: DocGinExtService;
    let docGinItem: DocGinItemExtService;
    let docGrn: DocGrnExtService;
    let docGrnItem: DocGrnItemExtService;
    let docPo: DocPoExtService;
    let docPoItem: DocPoItemExtService;
    let docSo: DocSoExtService;
    let docSoItem: DocSoItemExtService;
    let docPos: DocPosExtService;
    let docPosItem: DocPosItemExtService;
    let docShip: DocShipExtService;
    let docShipItem: DocShipItemExtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TenantModule,
            ],
            
            providers: [
                RedisSequenceService,
                RedisLockService,
                ...ALL_PROVIDER
            ],

        }).compile();

        const ds =  await testDS(betterSqliteConfig(bid, entities))

        bizService = moduleRef.get<BizExtService>(BizExtService, { strict: false });
        docGinItem = moduleRef.get<DocGinItemExtService>(DocGinItemExtService, { strict: false });
        docGin = moduleRef.get<DocGinExtService>(DocGinExtService, { strict: false });
        docGrn = moduleRef.get<DocGrnExtService>(DocGrnExtService, { strict: false });
        docGrnItem = moduleRef.get<DocGrnItemExtService>(DocGrnItemExtService, { strict: false });
        docPo = moduleRef.get<DocPoExtService>(DocPoExtService, { strict: false });
        docPoItem = moduleRef.get<DocPoItemExtService>(DocPoItemExtService, { strict: false });
        docSo = moduleRef.get<DocSoExtService>(DocSoExtService, { strict: false });
        docSoItem = moduleRef.get<DocSoItemExtService>(DocSoItemExtService, { strict: false });
        docPos = moduleRef.get<DocPosExtService>(DocPosExtService, { strict: false });
        docPosItem = moduleRef.get<DocPosItemExtService>(DocPosItemExtService, { strict: false });
        docShip = moduleRef.get<DocShipExtService>(DocShipExtService, { strict: false });
        docShipItem = moduleRef.get<DocShipItemExtService>(DocShipItemExtService, { strict: false });
    
    })
    describe('Load Country State City', () => {
        it('Load DocGin', async () => {
            try {
                const doc: any[] = require('./test-data/doc-gin.json')
                doc.forEach( d => {
                    d.child = {
                        docGinItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docGin.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
        it('Load DocGrn', async () => {
            try {
                const doc: any[] = require('./test-data/doc-grn.json')
                doc.forEach( d => {
                    d.child = {
                        docGrnItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docGrn.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
        it('Load DocPo', async () => {
            try {
                const doc: any[] = require('./test-data/doc-po.json')
                doc.forEach( d => {
                    d.child = {
                        docPoItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docPo.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
        it('Load DocSo', async () => {
            try {
                const doc: any[] = require('./test-data/doc-so.json')
                doc.forEach( d => {
                    d.child = {
                        docSoItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docSo.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
        it('Load DocPos', async () => {
            try {
                const doc: any[] = require('./test-data/doc-pos.json')
                doc.forEach( d => {
                    d.child = {
                        docPosItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docPos.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
        it('Load DocShip', async () => {
            try {
                const doc: any[] = require('./test-data/doc-ship.json')
                doc.forEach( d => {
                    d.child = {
                        docShipItem: [...d.docItem]
                    }
                    delete d.docItem;
                })
                await docShip.add(bid, brid, doc);
            } catch(e) {
                console.log(e)
            }
        })
    })

})