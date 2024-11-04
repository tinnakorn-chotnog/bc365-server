import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppShortcutBase } from './app-shortcut.base.type';

@ObjectType()
export class AppShortcut extends AppShortcutBase {
}
