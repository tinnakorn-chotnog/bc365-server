import { Resolver } from "@nestjs/graphql";
import { CountryResolver } from "./country.resolver";
import { Country } from "./country.type";

@Resolver(() => Country)
export class CountryExtResolver extends CountryResolver {    
}
