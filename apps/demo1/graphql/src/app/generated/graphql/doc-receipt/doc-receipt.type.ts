import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocReceiptBase } from './doc-receipt.base.type';

@ObjectType()
export class DocReceipt extends DocReceiptBase {
}
