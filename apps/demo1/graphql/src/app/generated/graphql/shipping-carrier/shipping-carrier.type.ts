import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ShippingCarrierBase } from './shipping-carrier.base.type';

@ObjectType()
export class ShippingCarrier extends ShippingCarrierBase {
}
