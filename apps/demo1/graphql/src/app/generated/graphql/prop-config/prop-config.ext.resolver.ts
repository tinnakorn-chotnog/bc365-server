import { Resolver } from "@nestjs/graphql";
import { PropConfigResolver } from "./prop-config.resolver";
import { PropConfig } from "./prop-config.type";

@Resolver(() => PropConfig)
export class PropConfigExtResolver extends PropConfigResolver {    
}
