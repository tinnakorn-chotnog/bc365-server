import { Resolver } from "@nestjs/graphql";
import { ShippingCarrierResolver } from "./shipping-carrier.resolver";
import { ShippingCarrier } from "./shipping-carrier.type";

@Resolver(() => ShippingCarrier)
export class ShippingCarrierExtResolver extends ShippingCarrierResolver {    
}
