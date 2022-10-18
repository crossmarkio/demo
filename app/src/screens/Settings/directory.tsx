import Accounts from './routes/accounts';
import Advanced from './routes/advanced';
import Book from './routes/book';
import Credits from './routes/credits';
import General from './routes/general';
import Security from './routes/security';
import Support from './routes/support';
import Terms from './routes/terms'; 
import Nodes from './routes/nodes'; 

interface IScreenDir {
[index: string]:() => JSX.Element
}

const directory:IScreenDir =  {
"accounts": Accounts, 
"advanced": Advanced, 
"book": Book, 
"credits": Credits, 
"general": General, 
"security": Security, 
"support": Support, 
"terms": Terms,
"nodes": Nodes 
};

export default directory