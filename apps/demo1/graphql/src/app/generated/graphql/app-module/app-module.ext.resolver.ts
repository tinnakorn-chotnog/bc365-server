import { Resolver } from "@nestjs/graphql";
import { AppModuleResolver } from "./app-module.resolver";
import { AppModule } from "./app-module.type";

@Resolver(() => AppModule)
export class AppModuleExtResolver extends AppModuleResolver {    
}
