import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocArrItemBase } from './doc-arr-item.base.type';

@ObjectType()
export class DocArrItem extends DocArrItemBase {
}
