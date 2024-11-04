import { Resolver } from "@nestjs/graphql";
import { PriceBookCascadeResolver } from "./price-book-cascade.resolver";
import { PriceBookCascade } from "./price-book-cascade.type";

@Resolver(() => PriceBookCascade)
export class PriceBookCascadeExtResolver extends PriceBookCascadeResolver {    
}
