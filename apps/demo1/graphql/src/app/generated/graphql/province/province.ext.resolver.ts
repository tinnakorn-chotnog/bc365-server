import { Resolver } from "@nestjs/graphql";
import { ProvinceResolver } from "./province.resolver";
import { Province } from "./province.type";

@Resolver(() => Province)
export class ProvinceExtResolver extends ProvinceResolver {    
}
