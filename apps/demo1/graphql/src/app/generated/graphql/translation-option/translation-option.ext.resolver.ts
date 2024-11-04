import { Resolver } from "@nestjs/graphql";
import { TranslationOptionResolver } from "./translation-option.resolver";
import { TranslationOption } from "./translation-option.type";

@Resolver(() => TranslationOption)
export class TranslationOptionExtResolver extends TranslationOptionResolver {    
}
