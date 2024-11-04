import { Resolver } from "@nestjs/graphql";
import { ShippingZoneResolver } from "./shipping-zone.resolver";
import { ShippingZone } from "./shipping-zone.type";

@Resolver(() => ShippingZone)
export class ShippingZoneExtResolver extends ShippingZoneResolver {    
}
