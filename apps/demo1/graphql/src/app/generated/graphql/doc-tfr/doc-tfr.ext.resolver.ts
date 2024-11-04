import { Resolver } from "@nestjs/graphql";
import { DocTfrResolver } from "./doc-tfr.resolver";
import { DocTfr } from "./doc-tfr.type";

@Resolver(() => DocTfr)
export class DocTfrExtResolver extends DocTfrResolver {    
}
