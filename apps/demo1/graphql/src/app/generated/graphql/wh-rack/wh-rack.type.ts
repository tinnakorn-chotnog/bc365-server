import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhRackBase } from './wh-rack.base.type';

@ObjectType()
export class WhRack extends WhRackBase {
}
