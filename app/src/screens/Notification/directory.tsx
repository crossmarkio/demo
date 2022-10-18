import Grant from './routes/grant';
import Wallet from './routes/wallet';
import Signin from './routes/signin';

interface IScreenDir {
[index: string]:(props:any) => JSX.Element
}

const directory:IScreenDir =  {
"grant": Grant, 
"wallet": Wallet, 
"signin":Signin
};

export default directory