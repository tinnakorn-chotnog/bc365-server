import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocPickBase } from './doc-pick.base.type';

@ObjectType()
export class DocPick extends DocPickBase {
}
