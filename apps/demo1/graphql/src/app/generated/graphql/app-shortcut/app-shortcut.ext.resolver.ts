import { Resolver } from "@nestjs/graphql";
import { AppShortcutResolver } from "./app-shortcut.resolver";
import { AppShortcut } from "./app-shortcut.type";

@Resolver(() => AppShortcut)
export class AppShortcutExtResolver extends AppShortcutResolver {    
}
