import { Resolver } from "@nestjs/graphql";
import { DeliveryMethodResolver } from "./delivery-method.resolver";
import { DeliveryMethod } from "./delivery-method.type";

@Resolver(() => DeliveryMethod)
export class DeliveryMethodExtResolver extends DeliveryMethodResolver {    
}
