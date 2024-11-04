import { Resolver } from "@nestjs/graphql";
import { PriceBookItemResolver } from "./price-book-item.resolver";
import { PriceBookItem } from "./price-book-item.type";

@Resolver(() => PriceBookItem)
export class PriceBookItemExtResolver extends PriceBookItemResolver {    
}
