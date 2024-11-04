import { Resolver } from "@nestjs/graphql";
import { DocRunningGroupResolver } from "./doc-running-group.resolver";
import { DocRunningGroup } from "./doc-running-group.type";

@Resolver(() => DocRunningGroup)
export class DocRunningGroupExtResolver extends DocRunningGroupResolver {    
}
