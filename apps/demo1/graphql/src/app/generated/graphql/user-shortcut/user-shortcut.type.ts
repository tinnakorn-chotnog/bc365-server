import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UserShortcutBase } from './user-shortcut.base.type';

@ObjectType()
export class UserShortcut extends UserShortcutBase {
}
