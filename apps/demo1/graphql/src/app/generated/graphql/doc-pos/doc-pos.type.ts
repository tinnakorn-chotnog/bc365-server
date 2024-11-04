import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocPosBase } from './doc-pos.base.type';

@ObjectType()
export class DocPos extends DocPosBase {
}
