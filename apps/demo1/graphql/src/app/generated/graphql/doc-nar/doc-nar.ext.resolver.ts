import { Resolver } from "@nestjs/graphql";
import { DocNarResolver } from "./doc-nar.resolver";
import { DocNar } from "./doc-nar.type";

@Resolver(() => DocNar)
export class DocNarExtResolver extends DocNarResolver {    
}
