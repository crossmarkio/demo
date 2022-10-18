import Input from './routes/input';
import Xumm from './routes/xumm';
import Destination from './routes/destination';
import Account from './routes/account';
import Network from './routes/network';
import Asset from './routes/asset';
import Dial from './routes/dial';


interface IScreenDir {
[index: string]:() => JSX.Element
}

const directory:IScreenDir =  {
"input": Input, 
"xumm": Xumm, 
"destination": Destination, 
"account": Account, 
"network": Network, 
"asset": Asset,
"dial": Dial
};

export default directory