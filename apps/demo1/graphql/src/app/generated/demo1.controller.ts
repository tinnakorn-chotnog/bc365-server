import { Controller, Get, Post, Param } from '@nestjs/common';
import { Demo1Service } from './demo1.service';

@Controller('demo1')
export class Demo1Controller {

    constructor(
        private demo1Service: Demo1Service
    ) {}

}
