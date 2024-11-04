import { Resolver } from "@nestjs/graphql";
import { DocTfoResolver } from "./doc-tfo.resolver";
import { DocTfo } from "./doc-tfo.type";

@Resolver(() => DocTfo)
export class DocTfoExtResolver extends DocTfoResolver {    
}
