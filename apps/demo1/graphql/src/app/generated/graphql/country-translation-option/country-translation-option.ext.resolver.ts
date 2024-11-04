import { Resolver } from "@nestjs/graphql";
import { CountryTranslationOptionResolver } from "./country-translation-option.resolver";
import { CountryTranslationOption } from "./country-translation-option.type";

@Resolver(() => CountryTranslationOption)
export class CountryTranslationOptionExtResolver extends CountryTranslationOptionResolver {    
}
