import { Resolver } from "@nestjs/graphql";
import { BizTranslationOptionResolver } from "./biz-translation-option.resolver";
import { BizTranslationOption } from "./biz-translation-option.type";

@Resolver(() => BizTranslationOption)
export class BizTranslationOptionExtResolver extends BizTranslationOptionResolver {    
}
