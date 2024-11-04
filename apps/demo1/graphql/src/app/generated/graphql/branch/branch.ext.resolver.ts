import { Resolver } from "@nestjs/graphql";
import { BranchResolver } from "./branch.resolver";
import { Branch } from "./branch.type";

@Resolver(() => Branch)
export class BranchExtResolver extends BranchResolver {    
}
