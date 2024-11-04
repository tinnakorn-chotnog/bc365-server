import { Resolver } from "@nestjs/graphql";
import { DocTaskResolver } from "./doc-task.resolver";
import { DocTask } from "./doc-task.type";

@Resolver(() => DocTask)
export class DocTaskExtResolver extends DocTaskResolver {    
}
