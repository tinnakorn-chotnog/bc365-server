import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropUnitTypeBase } from './prop-unit-type.base.type';

@ObjectType()
export class PropUnitType extends PropUnitTypeBase {
}
