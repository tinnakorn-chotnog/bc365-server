import { Resolver } from "@nestjs/graphql";
import { DocArivResolver } from "./doc-ariv.resolver";
import { DocAriv } from "./doc-ariv.type";

@Resolver(() => DocAriv)
export class DocArivExtResolver extends DocArivResolver {    
}
