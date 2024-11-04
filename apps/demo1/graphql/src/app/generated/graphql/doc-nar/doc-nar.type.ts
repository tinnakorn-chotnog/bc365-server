import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocNarBase } from './doc-nar.base.type';

@ObjectType()
export class DocNar extends DocNarBase {
}
