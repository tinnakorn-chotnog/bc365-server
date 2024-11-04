import { Resolver } from "@nestjs/graphql";
import { PropServiceTypeResolver } from "./prop-service-type.resolver";
import { PropServiceType } from "./prop-service-type.type";

@Resolver(() => PropServiceType)
export class PropServiceTypeExtResolver extends PropServiceTypeResolver {    
}
