import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhHuBase } from './wh-hu.base.type';

@ObjectType()
export class WhHu extends WhHuBase {
}
