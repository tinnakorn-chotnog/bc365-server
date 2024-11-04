import { Resolver } from "@nestjs/graphql";
import { DocCrjResolver } from "./doc-crj.resolver";
import { DocCrj } from "./doc-crj.type";

@Resolver(() => DocCrj)
export class DocCrjExtResolver extends DocCrjResolver {    
}
