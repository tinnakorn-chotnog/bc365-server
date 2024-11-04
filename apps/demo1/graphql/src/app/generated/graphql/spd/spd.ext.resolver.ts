import { Resolver } from "@nestjs/graphql";
import { SpdResolver } from "./spd.resolver";
import { Spd } from "./spd.type";

@Resolver(() => Spd)
export class SpdExtResolver extends SpdResolver {    
}
