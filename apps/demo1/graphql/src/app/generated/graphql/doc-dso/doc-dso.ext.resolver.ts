import { Resolver } from "@nestjs/graphql";
import { DocDsoResolver } from "./doc-dso.resolver";
import { DocDso } from "./doc-dso.type";

@Resolver(() => DocDso)
export class DocDsoExtResolver extends DocDsoResolver {    
}
