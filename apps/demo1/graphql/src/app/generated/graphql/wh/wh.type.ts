import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhBase } from './wh.base.type';

@ObjectType()
export class Wh extends WhBase {
}
