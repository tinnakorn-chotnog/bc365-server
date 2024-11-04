import { Resolver } from "@nestjs/graphql";
import { DocNarItemResolver } from "./doc-nar-item.resolver";
import { DocNarItem } from "./doc-nar-item.type";

@Resolver(() => DocNarItem)
export class DocNarItemExtResolver extends DocNarItemResolver {    
}
