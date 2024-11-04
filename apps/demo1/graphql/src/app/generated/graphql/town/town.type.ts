import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { TownBase } from './town.base.type';

@ObjectType()
export class Town extends TownBase {
}
