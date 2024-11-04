import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocSoBase } from './doc-so.base.type';

@ObjectType()
export class DocSo extends DocSoBase {
}
