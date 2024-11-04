import { Resolver } from "@nestjs/graphql";
import { DistrictsResolver } from "./districts.resolver";
import { Districts } from "./districts.type";

@Resolver(() => Districts)
export class DistrictsExtResolver extends DistrictsResolver {    
}
