import { Resolver } from "@nestjs/graphql";
import { ColorResolver } from "./color.resolver";
import { Color } from "./color.type";

@Resolver(() => Color)
export class ColorExtResolver extends ColorResolver {    
}
