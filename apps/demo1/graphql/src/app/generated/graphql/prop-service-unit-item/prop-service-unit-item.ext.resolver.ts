import { Resolver } from "@nestjs/graphql";
import { PropServiceUnitItemResolver } from "./prop-service-unit-item.resolver";
import { PropServiceUnitItem } from "./prop-service-unit-item.type";

@Resolver(() => PropServiceUnitItem)
export class PropServiceUnitItemExtResolver extends PropServiceUnitItemResolver {    
}
