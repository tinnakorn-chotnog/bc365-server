import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocCdjBase } from './doc-cdj.base.type';

@ObjectType()
export class DocCdj extends DocCdjBase {
}
