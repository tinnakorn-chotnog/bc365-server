import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SpdBase } from './spd.base.type';

@ObjectType()
export class Spd extends SpdBase {
}
