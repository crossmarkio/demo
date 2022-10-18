import Input from './routes/input';
import Xumm from './routes/xumm';
import Seed from './routes/seed';
import Added from './routes/added';
import Keyname from './routes/keyname';
import Generate from './routes/generate';
import Warning from './routes/warning';
import SeedOptions from './routes/seedOptions';
import WriteDown from './routes/writeDown';

interface IScreenDir {
[index: string]:() => JSX.Element
}

const directory:IScreenDir =  {
"input": Input, 
"xumm": Xumm, 
"seed": Seed,
"added": Added,
"keyname": Keyname,
"generate": Generate,
"warning": Warning,
'seedOptions': SeedOptions,
'writeDown': WriteDown
};

export default directory