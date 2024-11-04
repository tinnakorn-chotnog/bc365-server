import { Resolver } from "@nestjs/graphql";
import { PaymentMethodResolver } from "./payment-method.resolver";
import { PaymentMethod } from "./payment-method.type";

@Resolver(() => PaymentMethod)
export class PaymentMethodExtResolver extends PaymentMethodResolver {    
}
