import { Resolver } from "@nestjs/graphql";
import { DocCdjResolver } from "./doc-cdj.resolver";
import { DocCdj } from "./doc-cdj.type";

@Resolver(() => DocCdj)
export class DocCdjExtResolver extends DocCdjResolver {    
}
