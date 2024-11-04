import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ShippingZoneBase } from './shipping-zone.base.type';

@ObjectType()
export class ShippingZone extends ShippingZoneBase {
}
