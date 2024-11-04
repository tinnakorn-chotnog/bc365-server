import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PropFacilityBase } from './prop-facility.base.type';

@ObjectType()
export class PropFacility extends PropFacilityBase {
}
