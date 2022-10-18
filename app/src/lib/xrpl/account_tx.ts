import { rippleTimeToUnixTime } from 'xrpl'

const account_tx = async (api, account) => {

  try{
  
  let request = {
    command: 'account_tx',
    account: account
  }

  let response = await api.request(request)

  for ( let i=0; i<response.result.transactions.length; i++ ) {
    if (response.result.transactions[i].tx.date) response.result.transactions[i].tx.date = rippleTimeToUnixTime(response.result.transactions[i].tx.date)
  }

  return response.result

} catch(error:any) {
  console.log(error)
  return undefined
}
}


export default account_tx