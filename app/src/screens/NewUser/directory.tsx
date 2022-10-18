import Email from './routes/email';
import Input from './routes/input';
import Terms from './routes/terms';
import Recovery from './routes/recovery';

interface IScreenDir {
[index: string]:() => JSX.Element
}

const directory:IScreenDir =  {
"input": Input, 
"terms": Terms, 
"email": Email,
"recovery": Recovery
};

export default directory