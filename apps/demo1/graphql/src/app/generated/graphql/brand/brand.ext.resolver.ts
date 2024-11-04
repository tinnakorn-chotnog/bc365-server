import { Resolver } from "@nestjs/graphql";
import { BrandResolver } from "./brand.resolver";
import { Brand } from "./brand.type";

@Resolver(() => Brand)
export class BrandExtResolver extends BrandResolver {    
}
