import { Resolver } from "@nestjs/graphql";
import { WhControllerResolver } from "./wh-controller.resolver";
import { WhController } from "./wh-controller.type";

@Resolver(() => WhController)
export class WhControllerExtResolver extends WhControllerResolver {    
}
