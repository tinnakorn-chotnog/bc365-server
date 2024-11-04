import { Resolver } from "@nestjs/graphql";
import { BizLanguageResolver } from "./biz-language.resolver";
import { BizLanguage } from "./biz-language.type";

@Resolver(() => BizLanguage)
export class BizLanguageExtResolver extends BizLanguageResolver {    
}
