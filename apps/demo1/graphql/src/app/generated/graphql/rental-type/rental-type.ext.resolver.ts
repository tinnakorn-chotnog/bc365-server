import { Resolver } from "@nestjs/graphql";
import { RentalTypeResolver } from "./rental-type.resolver";
import { RentalType } from "./rental-type.type";

@Resolver(() => RentalType)
export class RentalTypeExtResolver extends RentalTypeResolver {    
}
