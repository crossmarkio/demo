import Add from './Add';
import Apps from './Apps';
import Cards from './Cards';
import Dashboard from './Dashboard';
import Error from './Error';
import Home from './Home';
import Landing from './Landing';
import Loading from './Loading';
import Login from './Login';
import Markets from './Markets';
import Pin from './Pin';
import Settings from './Settings';
import Sign from './Sign';
import Unlock from './Unlock';
import Wallet from './Wallet';
import NewUser from './NewUser';
import WalletInterface from './WalletInterface';
import Send from './Send';

interface IProps {
    request?:any
    wallet?:any
}

interface IScreen {
[index: string]:({ request }: IProps) => JSX.Element
}

const directory:IScreen =  {
"Add": Add, 
"Apps": Apps, 
"Cards": Cards, 
"Dashboard": Dashboard, 
"Error": Error, 
"Home": Home, 
"Landing": Landing, 
"Loading": Loading, 
"Login": Login, 
"Markets": Markets, 
"Pin": Pin, 
"Settings": Settings, 
"Sign": Sign, 
"Unlock": Unlock, 
"Wallet": Wallet, 
"NewUser": NewUser, 
"WalletInterface": WalletInterface, 
"Send":Send
};

export default directory