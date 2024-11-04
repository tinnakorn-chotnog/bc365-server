import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { WhZoneBase } from './wh-zone.base.type';

@ObjectType()
export class WhZone extends WhZoneBase {
}
