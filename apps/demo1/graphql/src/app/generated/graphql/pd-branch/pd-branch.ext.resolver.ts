import { Resolver } from "@nestjs/graphql";
import { PdBranchResolver } from "./pd-branch.resolver";
import { PdBranch } from "./pd-branch.type";

@Resolver(() => PdBranch)
export class PdBranchExtResolver extends PdBranchResolver {    
}
