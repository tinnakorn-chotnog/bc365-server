import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocPffmBase } from './doc-pffm.base.type';

@ObjectType()
export class DocPffm extends DocPffmBase {
}
