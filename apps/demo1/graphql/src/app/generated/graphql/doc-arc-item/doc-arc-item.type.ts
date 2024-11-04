import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocArcItemBase } from './doc-arc-item.base.type';

@ObjectType()
export class DocArcItem extends DocArcItemBase {
}
