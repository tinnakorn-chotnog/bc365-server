import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocRestaOrdBase } from './doc-resta-ord.base.type';

@ObjectType()
export class DocRestaOrd extends DocRestaOrdBase {
}
