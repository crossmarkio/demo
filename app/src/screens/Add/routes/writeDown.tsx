import React, { useRef, useState, useEffect, RefObject }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as KeynameLogo } from '../../../assets/svg/keyname-banner.svg'

import { Cross, Check, ArrowLeft, AngleSmallRight,  } from '../../../components/Icons'

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


const WriteDown = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const addContext = useAddContext();

    const [ status, setStatus ] = useState<any>(undefined)
    const [ page, setPage ] = useState<any>(1)
    const [ pagination, setPagination ] = useState<any>(false)

    const color = storeContext.theme == 'light' ? 'black' : 'white';

    const handleBack = () => {
        addContext.setPage("input")
    }

    const handleClick = () => {
        addContext.setPage("keyname")  
    }

    const parseMnemonic = (secret:string) => {
        let array = secret.split(' ')
        let comp = array.map((word:string, index:number) =>  {
            if (pagination && page==1 && index>11) return
            if (pagination && page==2 && index<=11) return
            return (
                <div className={style.wordRow}>
                    <div className={style.number}>{index+1}</div>
                    <div className={style.word}>{word}</div>
                </div>
            )
        }).filter(Boolean)

        return <div className={style.wordContainer}>
                    <div className={style.wordWrapper}>
                        {comp}
                    </div>
                </div>
    }
    const parseNumbers= (secret:string[]) => {
        const alpha = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        let comp = secret.map((no:string, index:number) =>  {
                    return (
                        <div className={style.noWrapper}>
                            <div className={style.alpha}>{alpha[index]}</div>
                            <div className={style.number}>{no}</div>
                        </div>
                    )
                })
            return      <div className={style.numberWrapper}>
                            {comp}
                        </div>

    }

    const parseSecret = (key:string, seed:string) => {

        return <>
                    <div className={style.keyTitle}>PRIVATE KEY</div>
                    <div className={`${style.containerKey} ${style.private}`}>{key}</div>
                    <div className={style.keyTitle}>SECRET</div>
                    <div className={style.containerKey}>{seed}</div>
                </>
    }

    const secretRender = () => {
        if (addContext.data?.account.accountType == "mnemonic" ) return parseMnemonic(addContext.data?.account.secret.mnemonic)
        if (addContext.data?.account.accountType == "privateKey" ) return parseSecret(addContext.data?.account.keypair.privateKey,addContext.data?.account.secret.familySeed)
        if (addContext.data?.account.accountType == "secretNumbers" )return parseNumbers(addContext.data?.account.secret.secretNumbers)
        if (addContext.data?.account.accountType == "familySeed" ) return parseSecret(addContext.data?.account.keypair.privateKey,addContext.data?.account.secret.familySeed)
    }

    const handlePaginationClick = () => {
        if (page == 1) setPage(2)
        if (page == 2) setPage(1)
    }

    useEffect(() => {
        if (addContext.data?.account.accountType == "mnemonic" ) {
            let array = addContext.data?.account.secret.mnemonic.split(' ')
            if (array.length > 12) setPagination(true)
        }
    }, [])

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
                                    <div className={style.description}>Write down this secret and keep in a safe place. If this backup is lost, stolen, or destroyed, assets/tokens on this account will NOT be recoverable</div>
                                    {secretRender()}
                                </div>

                                 { pagination ? 
                                    <div className={style.pagination}>
                                        <div>{page}</div>
                                        <div>of</div>
                                        <div>2</div>
                                        <div className={`${style.arrow} ${page == 1 ? style.right : style.left}`}
                                            onClick={handlePaginationClick}>
                                            <AngleSmallRight size={14} fill={color}/>
                                        </div>
                                    </div>
                                    : null}

                                <div className={style.genericButtonContainer}>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleClick}
                                            className={style.button}
                                            >proceed
                                        </Button>
                                    </div>      
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default WriteDown

