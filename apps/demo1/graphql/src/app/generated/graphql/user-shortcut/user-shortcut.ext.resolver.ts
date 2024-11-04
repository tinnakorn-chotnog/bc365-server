import { Resolver } from "@nestjs/graphql";
import { UserShortcutResolver } from "./user-shortcut.resolver";
import { UserShortcut } from "./user-shortcut.type";

@Resolver(() => UserShortcut)
export class UserShortcutExtResolver extends UserShortcutResolver {    
}
