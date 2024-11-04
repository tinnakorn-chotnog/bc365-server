import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RefDocBase } from './ref-doc.base.type';

@ObjectType()
export class RefDoc extends RefDocBase {
}
