import { readdirSync } from 'fs';
import fs from 'fs';
import path from 'path';

const SCREEN_SOURCE_FOLDER = '../screens'

// some helpful functions
const isFolder = (file:any) => {file.split('.')[1]}

const toPascalCase = (string:any) => {
  string
    .match(/[a-z]+/gi)
    .map((word:string) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('');
}

// getting all the folder
const folders = readdirSync(SCREEN_SOURCE_FOLDER)
    .filter(file => file.split('.')[1] == null)

var mapContent = [
    folders
        .map((folder) => {
        return "import " + folder + " from './" + folder + "';";
    })
        .join('\n'),
    '',
    'interface IScreenDir {', 
    '[index: string]:() => JSX.Element',
    '}',
    '',
    'const directory:IScreenDir =  {',
    folders
        .map((folder) => { return "\"" + folder + "\": " + folder + ", "; }).join('\n'),
    '};',
    '',
    'export default directory'
].join('\n');

fs.writeFileSync("./directory.tsx", mapContent);

export default {}
