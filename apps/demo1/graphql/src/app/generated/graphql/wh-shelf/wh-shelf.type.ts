import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhShelfBase } from './wh-shelf.base.type';

@ObjectType()
export class WhShelf extends WhShelfBase {
}
