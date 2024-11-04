import { ModuleRef } from '@nestjs/core';
import { OnModuleInit } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { Dummy } from './dummy.type';

@Resolver(() => Dummy)
export class DummyResolver  implements OnModuleInit {

    constructor(private moduleRef: ModuleRef) {}

    onModuleInit(): void {
    }

}
