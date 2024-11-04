import { Resolver } from "@nestjs/graphql";
import { DocArrItemResolver } from "./doc-arr-item.resolver";
import { DocArrItem } from "./doc-arr-item.type";

@Resolver(() => DocArrItem)
export class DocArrItemExtResolver extends DocArrItemResolver {    
}
