import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { ArrowLeft, AngleSmallRight} from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useSendContext } from '../context'

const Input = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const sendContext = useSendContext();

    const handleAccountSelector = () => {
        sendContext.nav("account")

    }
    const handleDestinationSelector = () => {
        sendContext.nav("destination")
    }
    const handleNetworkSelector = () => {
        sendContext.nav("network")
    }

    const handleBack = () => {
        screenContext.setPage("Home")
    }

    const handleContinue = () => {
        sendContext.setPage("asset")
    }


    const color = storeContext.theme == 'light' ? 'black' : 'white'


    return (
                <>
                    <div className={style.inner}>

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
                                <div className={style.back} onClick={handleBack}>
                                    <ArrowLeft fill={color} size={28}/>
                                </div>

                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>SEND PAYMENT</div>
                                </div>

                                <div className={style.buttonContainer}>
                                    <div className={style.selectionTitle}>SELECT NETWORK</div>
                                        <Button
                                            type='secondary'
                                            theme={storeContext.theme}
                                            height={'40px'}
                                            onClick={handleNetworkSelector}
                                            className={style.selectionButton}
                                            >{ sendContext.data?.account ? sendContext.data?.account : 'network'}
                                            <AngleSmallRight className={style.tick} fill={color} size={12}/>
                                        </Button>
                                </div>
                                <div className={style.buttonContainer}>
                                    <div className={style.selectionTitle}>SELECT ACCOUNT</div>
                                        <Button
                                            type='secondary'
                                            theme={storeContext.theme}
                                            height={'40px'}
                                            onClick={handleAccountSelector}
                                            className={style.selectionButton}
                                            >{ sendContext.data?.account ? sendContext.data?.account : 'account'}
                                            <AngleSmallRight className={style.tick} fill={color} size={12}/>
                                        </Button>
                                </div>
                                <div className={style.buttonContainer}>
                                    <div className={style.selectionTitle}>SELECT DESTINATION</div>
                                        <Button
                                            type='secondary'
                                            theme={storeContext.theme}
                                            height={'40px'}
                                            onClick={handleDestinationSelector}
                                            className={style.selectionButton}
                                            >{ sendContext.data?.destination ? sendContext.data?.destination : 'destination'}
                                            <AngleSmallRight className={style.tick} fill={color} size={12}/>
                                        </Button>
                                    </div>

                                    <div className={style.absoluteButtonContainer}>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleContinue}
                                            className={style.button}
                                            >continue
                                        </Button>
                                    </div>    
                                </div>
                        </div>
                    </div>
                </>
        )
    }

export default Input

