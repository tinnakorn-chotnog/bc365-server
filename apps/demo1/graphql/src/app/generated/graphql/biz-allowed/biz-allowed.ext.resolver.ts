import { Resolver } from "@nestjs/graphql";
import { BizAllowedResolver } from "./biz-allowed.resolver";
import { BizAllowed } from "./biz-allowed.type";

@Resolver(() => BizAllowed)
export class BizAllowedExtResolver extends BizAllowedResolver {    
}
