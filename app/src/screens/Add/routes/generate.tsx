import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as KeynameLogo } from '../../../assets/svg/keyname-banner.svg'

import { Cross, Check, ArrowLeft, AngleSmallRight} from '../../../components/Icons'

import Button from '../../../components/Button'
import SecretNumber from '../component/secretNumber'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useAddContext } from '../context'
import { useAuthContext } from '../../../store/auth';

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'

import XummComponent from '../../../components/Xumm'

import { decrypt, encrypt } from '../../../lib/utils/crypto'

import { addWalletToChain, addKeyToChain } from '../../../lib/helpers'

import { Wallet } from 'xrpl'
import {generate, derive} from 'xrpl-accountlib'

const Generate = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const addContext = useAddContext();

    const [ strength, setStrength ] = useState<boolean>(false)
    const seedRef = useRef<HTMLInputElement>(null)

    const color = storeContext.theme == 'light' ? 'black' : 'white';

    const handleBack = () => {
        addContext.setPage("input")
    }

    const handleSeedSelector = () => {
        addContext.nav("seedOptions")
    }

    const handleStrengthSelector = () => {
        setStrength(!strength)
    }

    const handleGenerate = () => {
        let genType = addContext.data?.type
        let obj:any

        if ( genType == 'secret numbers')obj = generate.secretNumbers()
        if ( genType == 'mnuemonic' && strength ==false) obj = generate.mnemonic({strength:128})
        if ( genType == 'mnuemonic' && strength ==true) obj = generate.mnemonic({strength:256})
        if ( genType == 'familySeed') obj = generate.familySeed()
        if ( genType == 'privateKey') obj = generate.familySeed()
        
        let newObj = {
            wallet: {
                "key": obj.address,
                "method": "crossmark",
            },
            account:obj
        }

        addContext.setData(newObj)
        addContext.setPage("writeDown")  
    }

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
                                <ArrowLeft fill={'black'} size={28}/>
                            </div>

                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>ADD WALLET</div>
                                </div>

                                <div className={style.container}>
                                    <div className={style.warningTitle}>generate wallet</div>
                                    <div className={style.warningDescription}>We will generate a new wallet for you and add it to crossmark. The key for the new wallet will be encryted and stored locally on your computed.</div>
                                </div>

                                <div className={style.seedContainer}>                              
                                    <div className={style.buttonContainer}>
                                        <div className={style.selectionTitle}>SELECT SEED TYPE</div>
                                        <Button
                                            type='secondary'
                                            theme={storeContext.theme}
                                            height={'40px'}
                                            onClick={handleSeedSelector}
                                            className={style.selectionButton}
                                            >{ addContext.data?.type ? addContext.data?.type : 'seed type'}
                                            <AngleSmallRight className={style.tick} fill={color} size={12}/>
                                        </Button>
                                    </div>


                                    {addContext.data?.type == 'mnuemonic' ? 
                                        <div className={style.strengthContainer}>                              
                                            <div className={style.selectionTitle}>SELECT STRENGTH</div>
                                                <div className={style.buttonContainer}>
                                                    <Button
                                                        type='secondary'
                                                        theme={storeContext.theme}
                                                        height={'40px'}
                                                        width={'95%'}
                                                        onClick={handleStrengthSelector}
                                                        loader={false}
                                                        className={`${style.strengthButtonLeft} ${ !strength ? style.selected : null}`}
                                                        >12 word
                                                    </Button>
                                                    <Button
                                                        type='secondary'
                                                        theme={storeContext.theme}
                                                        height={'40px'}
                                                        width={'95%'}
                                                        onClick={handleStrengthSelector}
                                                        loader={false}
                                                        className={`${style.strengthButtonRight} ${ strength ? style.selected : null}`}
                                                        >24 word
                                                    </Button>
                                                </div>
                                            </div> 
                                    : null
                                    }
                                </div>

                                <div className={style.genericButtonContainer}>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleGenerate}
                                            className={style.button}
                                            >generate
                                        </Button>
                                    </div>      
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default Generate

