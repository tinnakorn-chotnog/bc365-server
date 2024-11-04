import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PaymentGatewayBase } from './payment-gateway.base.type';

@ObjectType()
export class PaymentGateway extends PaymentGatewayBase {
}
