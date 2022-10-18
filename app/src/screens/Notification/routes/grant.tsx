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

import { grantOrigin, getManagerObject } from '../../../services/extension.service';

import XummComponent from '../../../components/Xumm'

interface IProps {
    payload?:any, 
    signin?:boolean, 
    permissions?:boolean
}

const Grant = (props:any) => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const notificationContext = useNotificationContext(); 

    const [ origin, setOrigin ] = useState<string|undefined>(undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleDecline = () => {
        console.log('declined')
        window.close()
    }

    const handleGrant = () => {
        let target = props.data.payload.sender.target
        let response = grantOrigin(target)

        console.log(props.data)
        if (!response) return console.log('error')
        props.data.access(true)
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

                                <div className={style.description}>is requesting access to crossmark</div>

                                <div className={style.accessContainer}>
                                    <div className={style.access}>
                                        <SignalAlt fill={color} size={16}/>
                                        <div>access to internet connection</div>
                                    </div>
                                    <div className={style.access}>
                                        <Wallet fill={color} size={16}/>
                                        <div>access to view wallet balances</div>
                                    </div>
                                    <div className={style.access}>
                                        <Key fill={color} size={16}/>
                                        <div>access to prompt payment requests</div>
                                    </div>
                                    <div className={style.access}>
                                        <SettingsSliders fill={color} size={16}/>
                                        <div>access to settings</div>
                                    </div>
                                </div>

                                <div className={style.absoluteButtonContainer}>
                                    <Button
                                        type='primary'
                                        theme={storeContext.theme}
                                        height={40}
                                        onClick={handleGrant}
                                        className={style.button}
                                        >grant access
                                    </Button>

                                    <Button
                                        type='secondary'
                                        theme={storeContext.theme}
                                        onClick={handleDecline}
                                        className={style.button}
                                        height={40}
                                        margin={0}
                                        >decline
                                    </Button>
                                </div>  

                            </div>
                        </div>
                    </>
        )
    }

export default Grant

