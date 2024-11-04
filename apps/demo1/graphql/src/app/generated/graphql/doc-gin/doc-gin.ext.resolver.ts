import { Resolver } from "@nestjs/graphql";
import { DocGinResolver } from "./doc-gin.resolver";
import { DocGin } from "./doc-gin.type";

@Resolver(() => DocGin)
export class DocGinExtResolver extends DocGinResolver {    
}
