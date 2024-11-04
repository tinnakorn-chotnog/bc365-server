import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropUnitFacilityBase } from './prop-unit-facility.base.type';

@ObjectType()
export class PropUnitFacility extends PropUnitFacilityBase {
}
