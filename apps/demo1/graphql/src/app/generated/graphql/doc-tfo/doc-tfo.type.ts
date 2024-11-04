import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocTfoBase } from './doc-tfo.base.type';

@ObjectType()
export class DocTfo extends DocTfoBase {
}
