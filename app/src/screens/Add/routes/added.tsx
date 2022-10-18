import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { Cross, Check, ArrowLeft, AngleSmallRight} from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useAddContext } from '../context'

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'

import XummComponent from '../../../components/Xumm'


const Added = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const addContext = useAddContext();

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

                            <div className={style.logo}>
                                <Crossmark stroke={color} size={36}/>
                                <div className={style.pageTitle}>ADD WALLET</div>
                            </div>

                            <div className={style.container}>
                                <div className={style.containerTitle}>success!</div>
                                {
                                    addContext.data.key 
                                    ? <div className={style.address}>{addContext.data.key}</div>
                                    : null
                                }
                                <div className={style.description}>wallet has been added to your account</div>
                            </div>

                            <div className={style.genericButtonContainer}>
                                <Button
                                    type='primary'
                                    theme={storeContext.theme}
                                    height={40}
                                    onClick={()=> console.log('clicked')}
                                    className={style.button}
                                    >add nickname
                                    
                                </Button>

                                <Button
                                    type='secondary'
                                    theme={storeContext.theme}
                                    onClick={() => screenContext.setPage('Cards')}
                                    className={style.button}
                                    height={40}
                                    >go to wallets
                                </Button>
                            </div>      
                        </div>

                        </div>
                    </div>
                </>
        )
    }

export default Added

