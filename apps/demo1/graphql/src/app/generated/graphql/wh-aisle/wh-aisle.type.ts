import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhAisleBase } from './wh-aisle.base.type';

@ObjectType()
export class WhAisle extends WhAisleBase {
}
