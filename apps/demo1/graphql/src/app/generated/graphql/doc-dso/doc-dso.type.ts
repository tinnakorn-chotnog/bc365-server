import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocDsoBase } from './doc-dso.base.type';

@ObjectType()
export class DocDso extends DocDsoBase {
}
