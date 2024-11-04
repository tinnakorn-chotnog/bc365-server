import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PaymentChannelBase } from './payment-channel.base.type';

@ObjectType()
export class PaymentChannel extends PaymentChannelBase {
}
