import { Resolver } from "@nestjs/graphql";
import { PaymentConditionResolver } from "./payment-condition.resolver";
import { PaymentCondition } from "./payment-condition.type";

@Resolver(() => PaymentCondition)
export class PaymentConditionExtResolver extends PaymentConditionResolver {    
}
