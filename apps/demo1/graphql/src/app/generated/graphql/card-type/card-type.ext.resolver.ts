import { Resolver } from "@nestjs/graphql";
import { CardTypeResolver } from "./card-type.resolver";
import { CardType } from "./card-type.type";

@Resolver(() => CardType)
export class CardTypeExtResolver extends CardTypeResolver {    
}
