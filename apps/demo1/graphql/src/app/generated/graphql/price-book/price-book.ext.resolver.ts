import { Resolver } from "@nestjs/graphql";
import { PriceBookResolver } from "./price-book.resolver";
import { PriceBook } from "./price-book.type";

@Resolver(() => PriceBook)
export class PriceBookExtResolver extends PriceBookResolver {    
}
