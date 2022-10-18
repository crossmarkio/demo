import React, {useEffect, useState, Suspense, lazy} from 'react'
import style from './index.module.scss'

import { useStoreContext } from '../store/store'
import { useScreenContext } from '../screens/context'
import accountService from '../services/account.service'

import Blank from '../components/Card/blank'

interface IWallet {
    name: string
    key: string
    color:string
}

interface IProps {
    type?: string|undefined
    drawer?: boolean|undefined
}

const CardComponent = lazy(() => import('../components/Card'));

const CardFactory = (type:string|undefined, drawer:boolean|undefined, wallet:IWallet, i:number, theme:string) => {
        return (
                <Suspense fallback={<div>Loading...</div>}>
                    <CardComponent 
                        key={i}
                        id={i}
                        wallet={wallet} 
                        theme={theme}
                        type={type}
                        drawer={drawer}
                    />
                </Suspense>
    );
}

const Cards = ({type, drawer}:IProps) => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const [ wallets , setWallets ] = useState<undefined|IWallet[]>(undefined)

    const fetchWallets = async () => {
        const wallets = storeContext.walletChain
        if (!wallets) return
        setWallets(wallets)
    }

    useEffect(() => { fetchWallets() }, [])

    const walletElements = () => {
        if (wallets == undefined
            || wallets.length == 0 ) return <Blank/>
        
        let array = wallets
            .map((wallet:IWallet, index:number) => CardFactory(type, drawer, wallet, index, storeContext.theme))
            .filter(Boolean)

        return array
    }

    return (
        <>
                {walletElements()}
        </>
);
}

export default Cards