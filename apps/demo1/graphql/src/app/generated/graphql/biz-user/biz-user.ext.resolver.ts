import { Resolver } from "@nestjs/graphql";
import { BizUserResolver } from "./biz-user.resolver";
import { BizUser } from "./biz-user.type";

@Resolver(() => BizUser)
export class BizUserExtResolver extends BizUserResolver {    
}
