import React, {useEffect, useState, Suspense, lazy} from 'react'
import style from '../screens/Wallet/index.module.scss'

import { useStoreContext } from '../store/store'
import account_balance from '../lib/xrpl/account_balance'
import account_tx from '../lib/xrpl/account_tx'
import WalletHeader from '../components/WalletHeader'
import InlineLoader from '../components/Animations/inline/InLineLoader'

interface IWallet {
    name: string
    key: string
    color:string
}

interface IAsset {
  currency: string
  value: string
  issuer?:string
}

interface Props {
    index:number
    wallet: IWallet
}

const AssetComponent = lazy(() => import('../components/Asset'));

export const AssetFactory = (asset:IAsset, i:number, theme:string) => {
        return (
                <Suspense fallback={<div>Loading...</div>}>
                    <AssetComponent 
                        key={i}
                        id={i}
                        asset={asset} 
                        theme={theme}
                    />
                </Suspense>
    );
}

const TableFactory = ({index, wallet}:Props ) => {

const storeContext = useStoreContext()

  const [balance, setBalance] = useState<any>();
  const [transactions, setTransactions] = useState<any>();

  const getAccountData = async (wallet:IWallet) => {
    let response = await account_balance(storeContext.client, wallet.key)
    if (response instanceof Error) return setBalance('error')
    setBalance(response)
  }

  const getAccountCurrencies = async (wallet:IWallet) => {
    let response = await account_tx(storeContext.client, wallet.key)
    if (response instanceof Error) return setBalance('error')
    setTransactions(response)
  }

  useEffect(() => {
    getAccountData(wallet)
    getAccountCurrencies(wallet)
  }, [storeContext.client, wallet])

    const tableElement = () => {
        if (!balance || !transactions ) return <div>Loading...</div> 
        if (balance == "error" || transactions  == "error" ) return <div>No tokens found.</div> 

        let array = balance
            .map((asset:IAsset, index:number) => AssetFactory(asset, index, storeContext.theme))
            .filter(Boolean)
        return array
    }

    return (
        <>
                {tableElement()}
        </>
);
}

export default TableFactory