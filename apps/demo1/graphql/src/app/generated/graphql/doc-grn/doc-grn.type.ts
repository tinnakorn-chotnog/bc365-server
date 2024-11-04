import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocGrnBase } from './doc-grn.base.type';

@ObjectType()
export class DocGrn extends DocGrnBase {
}
