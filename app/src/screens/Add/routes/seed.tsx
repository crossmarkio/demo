import React, { useRef, useState, useEffect, RefObject }from 'react'
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
import {generate, derive} from 'xrpl-accountlib'

interface IncrementedRef  {
    current: {
        A: HTMLInputElement | null
        B: HTMLInputElement | null
        C: HTMLInputElement | null
        D: HTMLInputElement | null
        E: HTMLInputElement | null
        F: HTMLInputElement | null
        G: HTMLInputElement | null
        H: HTMLInputElement | null
    }
}

const Seed = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const addContext = useAddContext();

    const [ status, setStatus ] = useState<any>(undefined)
    const seedRef = useRef<HTMLInputElement>(null)
    const mnuemonicRef = useRef<HTMLTextAreaElement>(null)
    const numbersRef = useRef<IncrementedRef>(null)

    const color = storeContext.theme == 'light' ? 'black' : 'white';

    const handleBack = () => {
        addContext.setPage("input")
    }

    const handleSeedSelector = () => {
        addContext.nav("seedOptions")
    }

    const handleChange = (e) => {
        //console.log(e.target.value)
    }

    const handleImport = () => {
        let genType = addContext.data?.type
        let obj:any, keys:string[]
        
        if ( genType == 'secret numbers') {

            if (
                !numbersRef.current?.current.A?.value ||
                !numbersRef.current?.current.B?.value ||
                !numbersRef.current?.current.C?.value ||
                !numbersRef.current?.current.D?.value ||
                !numbersRef.current?.current.E?.value ||
                !numbersRef.current?.current.F?.value ||
                !numbersRef.current?.current.G?.value ||
                !numbersRef.current?.current.H?.value) return
                
                keys = [
                numbersRef.current?.current.A?.value,
                numbersRef.current?.current.B?.value,
                numbersRef.current?.current.C?.value,
                numbersRef.current?.current.D?.value,
                numbersRef.current?.current.E?.value,
                numbersRef.current?.current.F?.value,
                numbersRef.current?.current.G?.value,
                numbersRef.current?.current.H?.value
            ]
            obj = derive.secretNumbers(keys,true)
        }

        if ( genType == 'mnuemonic' && mnuemonicRef.current) obj = derive.mnemonic(mnuemonicRef.current.value)
        if ( genType == 'familySeed' && seedRef.current) obj = derive.familySeed(seedRef.current.value)
        if ( genType == 'privateKey' && seedRef.current) obj = derive.privatekey(seedRef.current.value) 
        if(!obj) return console.log('something went wrong importing wallet')
        console.log(obj)

        let newObj = {
            wallet: {
                "key": obj.address,
                "method": "seed",
            },
            account:obj
        }

        addContext.setData(newObj)
        addContext.setPage("keyname")  
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
                                <ArrowLeft fill={color} size={28}/>
                            </div>

                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>ADD WALLET</div>
                                </div>

                                <div className={style.seedContainer}>
                                    <div className={style.title}>import seed account</div>
                                
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

                                    {
                                        addContext.data?.type == "mnuemonic" 
                                        ? <>
                                        <div className={style.mnuemonicTitle}>input mnuemonic phrase</div>
                                        <textarea ref={mnuemonicRef}
                                        placeholder={'12 or 24 word phrase, separated by space. ie. the lazy dog jumped over the river'}
                                        >
                                        </textarea>
                                        </>
                                        : addContext.data?.type == "secret numbers" ?  
                                        <>
                                        <div className={style.mnuemonicTitle}>input secret number</div>     
                                        <SecretNumber ref={numbersRef}/>
                                        </>
                                        :                    
                                        <Input
                                            ref={seedRef}
                                            className={style.seedInput}
                                            type='password'
                                            placeholder={ addContext.data?.type ? `enter ${addContext.data?.type}` : 'seed type'}
                                            label={ addContext.data?.type ? addContext.data?.type : 'seed'}
                                            onChange={handleChange}
                                            >
                                        </Input>
                                        
                                    }
                                </div>

                                <div className={style.genericButtonContainer}>
                                    <Button
                                        type='primary'
                                        theme={storeContext.theme}
                                        height={40}
                                        onClick={handleImport}
                                        className={style.button}
                                        >import
                                    </Button>
                                </div>      
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default Seed

