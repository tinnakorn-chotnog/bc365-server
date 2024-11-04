import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { AppRouteBase } from './app-route.base.type';

@ObjectType()
export class AppRoute extends AppRouteBase {
}
