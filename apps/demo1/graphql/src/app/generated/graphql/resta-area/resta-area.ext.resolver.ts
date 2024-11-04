import { Resolver } from "@nestjs/graphql";
import { RestaAreaResolver } from "./resta-area.resolver";
import { RestaArea } from "./resta-area.type";

@Resolver(() => RestaArea)
export class RestaAreaExtResolver extends RestaAreaResolver {    
}
