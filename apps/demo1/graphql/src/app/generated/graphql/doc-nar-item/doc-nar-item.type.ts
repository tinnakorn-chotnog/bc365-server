import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocNarItemBase } from './doc-nar-item.base.type';

@ObjectType()
export class DocNarItem extends DocNarItemBase {
}
