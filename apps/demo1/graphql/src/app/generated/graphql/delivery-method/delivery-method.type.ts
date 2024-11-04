import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { DeliveryMethodBase } from './delivery-method.base.type';

@ObjectType()
export class DeliveryMethod extends DeliveryMethodBase {
}
