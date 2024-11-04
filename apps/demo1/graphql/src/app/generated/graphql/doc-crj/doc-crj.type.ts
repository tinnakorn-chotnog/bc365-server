import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DocCrjBase } from './doc-crj.base.type';

@ObjectType()
export class DocCrj extends DocCrjBase {
}
