import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class Demo1Service {

    assets: string;

    constructor() {
        this.assets = join(__dirname, 'assets', 'schema');
    }

    getTables() {
        let rawdata = fs.readFileSync(this.assets + '/tables.json', 'utf8');
        return  JSON.parse(rawdata);
    }

    getTypes() {
        let rawdata = fs.readFileSync(this.assets + '/types.json', 'utf8');
        return  JSON.parse(rawdata);
    }

    getLabels() {
        let rawdata = fs.readFileSync(this.assets + '/labels.json', 'utf8');
        return  JSON.parse(rawdata);
    }

}
