import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppTypeBase } from './app-type.base.type';

@ObjectType()
export class AppType extends AppTypeBase {
}
