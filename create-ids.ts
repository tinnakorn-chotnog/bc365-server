import { existsSync } from "node:fs";
import * as short from  'short-uuid';
// parameters
// 1 filePath
// 1 pk name
if (process.argv.length < 4) {
    console.log('please input file path and primary key name');
    process.exit();
}
const filePath = process.argv[2]
const pkName = process.argv[3];
const path = process.cwd() + '/' + filePath;
if (!existsSync(path)) {
    console.log('file does not exists')
    process.exit();
}
const data = require(path);
if (!Array.isArray(data)) {
    console.log('json data should be an array')
    process.exit();
}
let i = 0;
const newData:object[] = [];
data.forEach( r => {
    const id = short.generate();
    const newItem = {
        _id: id,
        [pkName]:id,
        ...r
    }
    newData.push(newItem)
    i++;
})
console.log(JSON.stringify(newData,null,2));
