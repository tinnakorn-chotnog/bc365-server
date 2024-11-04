import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { SubcateBase } from './subcate.base.type';

@ObjectType()
export class Subcate extends SubcateBase {
}
