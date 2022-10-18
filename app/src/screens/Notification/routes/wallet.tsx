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

import XummComponent from '../../../components/Xumm'

interface IProps {
    payload?:any, 
    signin?:boolean, 
    permissions?:boolean
}

const Wallets = (props:any) => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const notificationContext = useNotificationContext(); 

    const [ origin, setOrigin ] = useState<string|undefined>(undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const wallets = () => {
        let wallets = storeContext.walletChain
        if (!wallets) return null
        let array = wallets.map((wallet) => 
            <div className={style.access}>
                    {wallet.name} {wallet.key}
            </div>
        )

        return array
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

                                <div className={style.description}>select wallets to grant access</div>

                                <div className={style.accessContainer}>

                                    { wallets() }
                                    <div className={style.access}>
                                        wallet 1
                                    </div>
                                    <div className={style.access}>
                                        wallet 2
                                    </div>
                                    <div className={style.access}>
                                        wallet 3
                                    </div>
                                    <div className={style.access}>
                                        wallet 4
                                    </div>
                                </div>

                                <div className={style.absoluteButtonContainer}>
                                    <Button
                                        type='secondary'
                                        theme={storeContext.theme}
                                        onClick={()=> console.log('clicked')}
                                        className={style.button}
                                        height={40}
                                        margin={0}
                                        >select
                                    </Button>
                                </div>  

                            </div>
                        </div>
                    </>
        )
    }

export default Wallets

