import { Resolver } from "@nestjs/graphql";
import { LanguageResolver } from "./language.resolver";
import { Language } from "./language.type";

@Resolver(() => Language)
export class LanguageExtResolver extends LanguageResolver {    
}
