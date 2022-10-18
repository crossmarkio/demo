import React, {Suspense, lazy, useState, useEffect} from 'react'
import style from './index.module.scss'

import { Placeholder, Add,Plus} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import Bubble from '../../components/Bubble'

import AssetListFactory from '../../containers/AssetListFactory'
import TokenListFactory from '../../containers/TokenListFactory'

import account_balance from '../../lib/xrpl/account_balance'

interface IWallet {
    name: string
    key: string
    color:string
}

const WalletFactory = lazy(() => import('../../containers/WalletFactory'));

const Wallet = () => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const [state, setState] = useState('assets') 
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const [balance, setBalance] = useState<any>();
  
    const getAccountData = async (wallet:IWallet) => {
      let response = await account_balance(storeContext.client, wallet.key)
      if (response instanceof Error) return setBalance('error')
      setBalance(response)
    }

    useEffect(() => {
        setBalance(undefined)
        getAccountData(screenContext.getData.wallet)
      }, [screenContext.getData.wallet, storeContext.client])
    

    return (
                <>
                    <div className={style.inner}>

                    <Header theme={storeContext.theme}/>

                    <TitleBock 
                        page="Wallet"
                        theme={storeContext.theme}
                        back="Cards"
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>
                            <Suspense fallback={<div>Loading...</div>}>
                                <WalletFactory
                                    index={screenContext.getData.index}
                                    wallet={screenContext.getData.wallet}
                                />
                            </Suspense>

                            {
                            balance == "error" ?
                                <div className={style.notActivated}>
                                    <div className={style.msg}>account not actived</div> 
                                    <div className={style.help}>how can I activate my account?</div>
                                </div> :
                                <>
                                <div className={style.header}>
                                    <div className={style.left}>
                                        <div className={`${style.assetsTitle} 
                                        ${ state == 'assets' ? style.active: null}`}
                                        onClick={() => setState('assets')}
                                        >assets</div>
                                        <div className={`${style.tokensTitle} 
                                        ${ state == 'tokens' ? style.active: null}`}
                                        onClick={() => setState('tokens')}
                                        >tokens</div>
                                        <div className={`${style.tokensTitle} 
                                        ${ state == 'history' ? style.active: null}`}
                                        onClick={() => setState('history')}
                                        >history</div>
                                    </div>
                                    <div className={style.right}>
                                        <div className={style.add}>
                                            <Plus color={color} size={16}/>
                                        </div>
                                    </div>
                                </div>

                                <div className={style.table}>
                                    <div className={style.scroll}>
                                        { state == 'assets' ? 
                                            <Suspense fallback={<div className={style.text}>loading...</div>}>
                                                <AssetListFactory
                                                    index={screenContext.getData.index}
                                                    wallet={screenContext.getData.wallet}
                                                />
                                            </Suspense>
                                            : state == 'tokens' ? 
                                            <Suspense fallback={<div className={style.text}>loading...</div>}>
                                                <div className={style.text}>coming soon...</div>
{/*                                                 <TokenListFactory
                                                    index={screenContext.getData.index}
                                                    wallet={screenContext.getData.wallet}
                                                /> */}
                                            </Suspense>
                                            : state == 'history' ? 
                                            <Suspense fallback={<div className={style.text}>loading...</div>}>
                                                <div className={style.text}>coming soon...</div>
{/*                                                 <TokenListFactory
                                                    index={screenContext.getData.index}
                                                    wallet={screenContext.getData.wallet}
                                                /> */}
                                            </Suspense>
                                            : null
                                        }
                                    </div>
                                </div>
                                </>
                            }
                        </div>

                        <div className={style.nav}>
                                <Bubble type={'settings'}/>
                                <Bubble/>
                        </div>
                    </div>
                </>
        )
    }

export default Wallet


