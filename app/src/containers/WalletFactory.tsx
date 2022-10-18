import React, { useEffect, useState } from 'react'

import { useStoreContext } from '../store/store'
import account_balance from '../lib/xrpl/account_balance'

import Wallet from '../components/Wallet'

import account_tx from '../lib/xrpl/account_tx'

interface IWallet {
    name: string
    key: string
    color:string
}

interface Props {
    index:number
    wallet: IWallet
}

const WalletFactory = ({index, wallet}:Props ) => {

    const storeContext = useStoreContext()

    const [balance, setBalance] = useState<any>();
    const [render, setRender] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<any>();

    const getAccountData = async (wallet:IWallet) => {
        let response = await account_balance(storeContext.client, wallet.key)
        if (response instanceof Error) return setBalance('error')
        setBalance(response)
    }

    const getAccountCurrencies = async (wallet:IWallet) => {
        let response = await account_tx(storeContext.client, wallet.key)
        if (response instanceof Error) return setTransactions('error')
        setTransactions(response)
    }

/*     const getAccountObjects = async (wallet:IWallet) => {
        let response = await account_objects(storeContext.client, wallet.key)
        if (response instanceof Error) return setTransactions('error')
        setTransactions(response)
    }

    const getAccountInfo = async (wallet:IWallet) => {
        let response = await account_info(storeContext.client, wallet.key)
        if (response instanceof Error) return setTransactions('error')
        setTransactions(response)
    }
 */
    useEffect(() => {
            getAccountData(wallet)
            getAccountCurrencies(wallet)
            //getAccountObjects(wallet)
            //getAccountInfo(wallet)
    }, [storeContext.client, wallet]) 

    if (!balance || !transactions ) return <div>Loading!!!!!</div>
    if ( balance == "error" 
         || transactions  == "error" ) return <Wallet
                                                active={false}
                                                key={index}
                                                index={index}
                                                wallet={wallet}
                                                theme={storeContext.theme}
                                                data={wallet}
                                            />

    return <Wallet
        key={index}
        index={index}
        wallet={wallet}
        theme={storeContext.theme}
        data={wallet}
    />
}

export default WalletFactory