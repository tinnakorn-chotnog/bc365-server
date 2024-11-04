import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocArcBase } from './doc-arc.base.type';

@ObjectType()
export class DocArc extends DocArcBase {
}
