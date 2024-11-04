import { Resolver } from "@nestjs/graphql";
import { PropServiceItemResolver } from "./prop-service-item.resolver";
import { PropServiceItem } from "./prop-service-item.type";

@Resolver(() => PropServiceItem)
export class PropServiceItemExtResolver extends PropServiceItemResolver {    
}
