import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhSuBase } from './wh-su.base.type';

@ObjectType()
export class WhSu extends WhSuBase {
}
