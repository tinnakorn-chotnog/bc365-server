import { Resolver } from "@nestjs/graphql";
import { DocArcItemResolver } from "./doc-arc-item.resolver";
import { DocArcItem } from "./doc-arc-item.type";

@Resolver(() => DocArcItem)
export class DocArcItemExtResolver extends DocArcItemResolver {    
}
