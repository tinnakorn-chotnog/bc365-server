import { Test } from '@nestjs/testing';
import { DocPoExtService } from './doc-po-ext.service';
import { DocPoPdfService } from './doc-po.pdf.service';
import { configSchema } from '@bc365-server/common/config/config-schema';
import { ConfigModule } from '@nestjs/config';
import { DOC_PO_PROVIDER } from './doc-po.provider';
import { createWriteStream } from 'fs';
import { invoice } from './invoice'
const Joi = require('joi');

jest.setTimeout(5000000);

describe('DOC_PO', () => {

    let docPoPdfService: DocPoPdfService;
    let docPoService: DocPoExtService

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
                DocPoPdfService,
                ...DOC_PO_PROVIDER,
            ],
        }).compile();

        docPoPdfService = app.get<DocPoPdfService>(DocPoPdfService);
        docPoService = app.get<DocPoExtService>(DocPoExtService);

    });

    afterAll(async () => {
    })


    describe('DOC_PO <test case group description>', () => {
        it('#1.1 <case description>', async () => {
            docPoPdfService.backgroundImageFile = '/home/tinnakornc/lab/nestjs/bc365-server/dist/apps/demo1/graphql/assets/images/bg-01.png'
            docPoPdfService.pageContent = invoice
            const doc = await docPoPdfService.createDoc()
            const file = createWriteStream("/home/tinnakornc/Desktop/pdf-test/doc-po.pdf");
            doc.pipe(file);
            doc.end();
        })
    })

});