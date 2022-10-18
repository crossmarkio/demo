import React, {useEffect, useState, Suspense, lazy} from 'react'
import style from '../screens/Dashboard/index.module.scss'

import account_balance from '../lib/xrpl/account_balance'
import Chart from '../components/Charts/pieChart'

import accountService from '../services/account.service'
import { useStoreContext } from '../store/store'
import { useScreenContext } from '../screens/context'

import Button from '../components/Button'

import { AssetFactory } from './AssetListFactory'

interface IAsset {
    currency: string
    value: string
    issuer?:string
  }


interface IWallet {
    name: string
    key: string
    color:string
}

interface ICurrency {
    currency: string
    value: string
    issuer?:string
}


const Portfolio = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const [ wallets , setWallets ] = useState<undefined|IWallet[]>(undefined)
    const [ balances, setBalances ] = useState<any>();


    const combineWalletWealth = async (wallets:(ICurrency[] | undefined)[]) => {
        if (wallets[0] == undefined) return 
        let array = wallets[0].map((item)=> {
            return { 
                currency : item.currency,
                issuer: item?.issuer,
                value: Number(item.value)
            }
        })

        wallets.forEach((wallet, index) => {
            if (index == 0 || wallet == undefined) return;
            if (wallet instanceof Error) return;
            wallet.forEach((currency) => {
                array.forEach((c, i) => {
                    if (c.currency == currency.currency &&
                        c.issuer == currency.issuer) array[i].value+=Number(currency.value)
                })
            })
        })

        let handledArray = array.map((item, i) => {
            let obj = {
                currency:item.currency,
                issuer:item.issuer,
                value:''
            }
            obj.value = String(item.value)
            return obj
        })

        return handledArray
    }

    const sortByLengthOfWallet = async (wallets:(ICurrency[] | undefined)[]) => {
        if (!wallets) return []
        let sortedArray = wallets.sort((a,b) => {
            if (b == undefined || a == undefined) return -1
            return b.length - a.length;
        }).filter(wallet =>  !(wallet instanceof Error))
        return sortedArray
    }

    const getWalletData = async (wallets:IWallet[]) => {
        let array = await Promise.all(wallets.map(async (wallet, index) => {
            let response = await account_balance(storeContext.client, wallet.key)
            if (response instanceof Error) return
            return response
            }).filter(Boolean))

        if (!array) return
        let sortedArray = await sortByLengthOfWallet(array)

        let combined = await combineWalletWealth(sortedArray)
        setBalances(combined)
      }

      const fetchWallets = async () => {
        const wallets = storeContext.walletChain
        console.log(wallets)
        if (!wallets) return
        setWallets(wallets)
    }

    useEffect(() => {
        if(!wallets) return
        getWalletData(wallets)
      }, [wallets])

    useEffect(() => {
        fetchWallets()
      }, [storeContext.client])

    const walletElements = () => {
        if (balances == undefined) return <div>Loading!!!!!</div>
        
        let array = balances
        .map((asset:IAsset, index:number) => AssetFactory(asset, index, storeContext.theme))
        .filter(Boolean)

        const handleNav = () => {
            screenContext.setPage('Cards')
        }

        return <>
                <Chart data={balances}/>
                <div className={style.totalBalance}>
                    <div className={style.title}>total balance</div>
                    <div className={style.amount}>$10,000</div>
                </div>
                <div className={style.totalWallets}>
                    <div className={style.title}>
                        <strong>{wallets?.length}</strong> total wallets
                    </div>
                    <Button
                        width={'60px'}
                        height={18}
                        margin={2}
                        color='white'
                        type='secondary'
                        theme={storeContext.theme}
                        onClick={handleNav}
                    >
                        see all
                    </Button>
                </div>
                <div className={style.header}>portfolio</div>
                <div className={style.table}>
                    {array}
                </div>
            
        </>
    }

    return (
        <>
                {walletElements()}
        </>
);
}

export default Portfolio