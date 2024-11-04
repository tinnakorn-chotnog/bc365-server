import { Resolver } from "@nestjs/graphql";
import { RestaBranchMenuResolver } from "./resta-branch-menu.resolver";
import { RestaBranchMenu } from "./resta-branch-menu.type";

@Resolver(() => RestaBranchMenu)
export class RestaBranchMenuExtResolver extends RestaBranchMenuResolver {    
}
