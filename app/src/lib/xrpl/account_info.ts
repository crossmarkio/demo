import { Client } from 'xrpl';
import { currencyHexToUTF8 } from '../utils/hexConversion';

const account_info = async (api:Client|undefined, account:string) => {
  try {
    if (api == undefined) return undefined

    let request = {
      command: 'account_info',
      account: account
    }
  
    let response = await api.request(request)

    console.log(response)

    return response;

  } catch(error:any) {
    return Error(error)
  }
}

export default account_info