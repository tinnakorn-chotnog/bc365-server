import { Resolver } from "@nestjs/graphql";
import { PaymentGatewayResolver } from "./payment-gateway.resolver";
import { PaymentGateway } from "./payment-gateway.type";

@Resolver(() => PaymentGateway)
export class PaymentGatewayExtResolver extends PaymentGatewayResolver {    
}
