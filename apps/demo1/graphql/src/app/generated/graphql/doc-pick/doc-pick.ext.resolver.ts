import { Resolver } from "@nestjs/graphql";
import { DocPickResolver } from "./doc-pick.resolver";
import { DocPick } from "./doc-pick.type";

@Resolver(() => DocPick)
export class DocPickExtResolver extends DocPickResolver {    
}
