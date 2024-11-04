import { Resolver } from "@nestjs/graphql";
import { PdCateResolver } from "./pd-cate.resolver";
import { PdCate } from "./pd-cate.type";

@Resolver(() => PdCate)
export class PdCateExtResolver extends PdCateResolver {    
}
