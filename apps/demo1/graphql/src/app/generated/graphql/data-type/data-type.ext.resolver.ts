import { Resolver } from "@nestjs/graphql";
import { DataTypeResolver } from "./data-type.resolver";
import { DataType } from "./data-type.type";

@Resolver(() => DataType)
export class DataTypeExtResolver extends DataTypeResolver {    
}
