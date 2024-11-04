import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocTfrBase } from './doc-tfr.base.type';

@ObjectType()
export class DocTfr extends DocTfrBase {
}
