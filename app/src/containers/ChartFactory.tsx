import React, {useEffect, useState, Suspense, lazy} from 'react'
import style from './index.module.scss'

import { useStoreContext } from '../store/store'
import account_balance from '../lib/xrpl/account_balance'
import account_tx from '../lib/xrpl/account_tx'

interface IWallet {
    name: string
    address: string
    color:string
}

interface IAsset {
  currency: string
  value: string
  issuer?:string
}

interface Props {
  currency: string
  value: string
  issuer?:string
  wallet:IWallet
}

const ChartComponent = lazy(() => import('../components/Charts/pieChart.jsx'));

const ChartFactory = (balance:IAsset[]) => {
        return (
                <Suspense fallback={<div>Loading...</div>}>
                    <ChartComponent 
                        data={balance}
                    />
                </Suspense>
    );
}

const Chart = ({wallet}:Props ) => {

const storeContext = useStoreContext()

  const [balance, setBalance] = useState<any>();
  const [transactions, setTransactions] = useState<any>();

  const getAccountData = async (wallet:IWallet) => {
    let response = await account_balance(storeContext.client, wallet.address)
    setBalance(response)
  }

  const getAccountCurrencies = async (wallet:IWallet) => {
    let response = await account_tx(storeContext.client, wallet.address)
    setTransactions(response)
  }

  useEffect(() => {
    getAccountData(wallet)
    getAccountCurrencies(wallet)
  }, [storeContext.client, wallet])

    const tableElement = () => {
        if (!balance || !transactions ) return <div>Loading...</div> 
        return ChartFactory(balance)
    }

    return (
        <>
                {tableElement()}
        </>
);
}



export default Chart