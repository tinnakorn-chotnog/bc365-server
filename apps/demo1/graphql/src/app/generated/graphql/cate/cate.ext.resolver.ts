import { Resolver } from "@nestjs/graphql";
import { CateResolver } from "./cate.resolver";
import { Cate } from "./cate.type";

@Resolver(() => Cate)
export class CateExtResolver extends CateResolver {    
}
