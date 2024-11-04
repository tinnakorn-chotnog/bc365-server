import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SuppGroupBase } from './supp-group.base.type';

@ObjectType()
export class SuppGroup extends SuppGroupBase {
}
