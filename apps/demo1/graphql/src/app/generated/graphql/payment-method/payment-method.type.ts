import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PaymentMethodBase } from './payment-method.base.type';

@ObjectType()
export class PaymentMethod extends PaymentMethodBase {
}
