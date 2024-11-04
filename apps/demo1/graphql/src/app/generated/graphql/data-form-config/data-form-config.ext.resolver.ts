import { Resolver } from "@nestjs/graphql";
import { DataFormConfigResolver } from "./data-form-config.resolver";
import { DataFormConfig } from "./data-form-config.type";

@Resolver(() => DataFormConfig)
export class DataFormConfigExtResolver extends DataFormConfigResolver {    
}
