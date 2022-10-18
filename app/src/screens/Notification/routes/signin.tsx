import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { 
    Placeholder, 
    Add,
    Plus, 
    Cross, 
    Check, 
    ArrowLeft, 
    AngleSmallRight, 
    Crossmark,
    Wallet,
    Key,
    SettingsSliders,
    SignalAlt } from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useNotificationContext } from '../context'

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'
import { getCrossmarkJWT, getBackgroundJWT, uuid, setBackgroundJWT} from '../../../services/extension.service'
import { pkce, pkceJWT } from '../../../services/xumm.service'

import XummComponent from '../../../components/Xumm'

interface IProps {
    payload?:any, 
    signin?:boolean, 
    permissions?:boolean
}

const Signin = (props:any) => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const notificationContext = useNotificationContext(); 

    const [ processing, setProcessing ] = useState<boolean>(false)
    const [ selected, setSelected ] = useState<number>(0)

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const wallets = () => {
        let walletChain = storeContext.walletChain
        if (!walletChain) return null
        let array = walletChain.map((wallet,index) => 
            <div 
                onClick={() => setSelected(index)}
                className={`${style.access} ${index == selected ? style.active : null}`}>
                    <div className={style.name}>{wallet.name}</div>
                    <div className={style.key}>{wallet.key}</div>
            </div>
        )

        return array
    }

    const generateNewTokenWithPKCE = async () => {
        let id = uuid()
        let popup = await pkce({
            key:props.data.payload.params.xummKey, 
            state:{
                key: props.data.payload.params.xummKey,
                id: id
            }
        })
        setProcessing(true)
        popup.addEventListener('message', async (event) => {
            if (event.origin != window.origin ) return;
            if (!event.data.id || event.data.id != id ) return;
            console.log(event.data);
            let resp = await setBackgroundJWT(event.data.key, event.data.jwt);
            console.log('signin successful');
        })
    }


    const handleSignIn = async () => {

        let walletChain = storeContext.walletChain
        let wallet = walletChain ? walletChain[selected] : null

        if (wallet.method == 'xumm') {
            let jwt = await getBackgroundJWT(props.data.payload.params.xummKey)
            if (jwt instanceof Error) generateNewTokenWithPKCE()
            if (!(jwt instanceof Error)) console.log('signin successful') 
        }

        if (wallet.method != 'xumm') console.log('signin successful')
    }


    return (
                        <>
                            <div className={style.background}>
                                <div className={`${style.absolute} ${style.tl}`}>
                                    <TopSvg width={400} height={'100%'}/>
                                </div>
                                <div className={`${style.absolute} ${style.br}`}>
                                    <BottomSvg width={400} height={'100%'}/>
                                </div>
                            </div>

                            <div className={style.foreground}>
                                <div className={style.container}>

                                    
                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>PERMISSIONS</div>
                                </div>

                                <div className={style.origin}>{props.data.payload.sender.origin}</div>

                                <div className={style.description}>{processing ? null : `select a signin account`}</div>

                                { processing ?
                                        <div className={style.processingContainer}>
                                        <div className={style.animatedContainer}></div>
                                            <div className={style.absoluteContainer}>
                                                <div>xumm oauth</div>
                                                <div>awaiting action...</div>
                                            </div>
                                        </div> :
                                        <div className={style.walletContainer}>
                                            <div className={style.scroll}>
                                                { wallets() }
                                            </div>
                                        </div>
                                    
                                }

                                <div className={style.genericButtonContainer}>

                                { processing ?
                                    <Button
                                        type='secondary'
                                        theme={storeContext.theme}
                                        onClick={handleSignIn}
                                        className={style.button}
                                        height={40}
                                        margin={0}
                                        >cancel
                                    </Button>
                                                                :
                                    <Button
                                        type='secondary'
                                        theme={storeContext.theme}
                                        onClick={handleSignIn}
                                        className={style.button}
                                        height={40}
                                        margin={0}
                                        >signin
                                    </Button>
                                }
                            </div> 
                        </div>
                    </div>
                </>
        )
    }

export default Signin

