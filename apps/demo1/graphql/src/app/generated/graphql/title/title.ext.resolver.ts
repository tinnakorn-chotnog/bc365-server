import { Resolver } from "@nestjs/graphql";
import { TitleResolver } from "./title.resolver";
import { Title } from "./title.type";

@Resolver(() => Title)
export class TitleExtResolver extends TitleResolver {    
}
