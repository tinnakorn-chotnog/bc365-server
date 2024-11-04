import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PaymentConditionBase } from './payment-condition.base.type';

@ObjectType()
export class PaymentCondition extends PaymentConditionBase {
}
