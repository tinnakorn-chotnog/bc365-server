import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocPoBase } from './doc-po.base.type';

@ObjectType()
export class DocPo extends DocPoBase {
}
