import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RentalTypeBase } from './rental-type.base.type';

@ObjectType()
export class RentalType extends RentalTypeBase {
}
