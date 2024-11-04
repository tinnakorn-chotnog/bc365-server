import { Resolver } from "@nestjs/graphql";
import { DocArrResolver } from "./doc-arr.resolver";
import { DocArr } from "./doc-arr.type";

@Resolver(() => DocArr)
export class DocArrExtResolver extends DocArrResolver {    
}
