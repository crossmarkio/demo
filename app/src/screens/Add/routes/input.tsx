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

interface ICheck  {
    status: Boolean
    msg:string|null
}

const NewUser = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const addContext = useAddContext();

    const [ accessToken, startRefreshTokenTimer ] = useRefresh();

    const [ buttonActive, setButtonActive] = useState<Boolean>(false)

    const [ emailCheck , setEmailCheck ] = useState<ICheck | undefined>(undefined)
    const [ usernameCheck , setUsernameCheck ] = useState<ICheck | undefined>(undefined)
    const [ passCheck , setPassCheck ] = useState<ICheck| undefined>(undefined)

    const handleSeed = () => {
        addContext.setPage("warning")
    }
    const handleXumm = () => {
        addContext.setPage("xumm")

    }
    const handlePlaceholder = () => {
        addContext.setPage("xumm")
    }
    const handleBack = () => {
        screenContext.setPage("Home")
    }

    const handleGenerate = () => {
        addContext.setPage("generate")
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
                            <div className={style.pageTitle}>ADD WALLET</div>
                        </div>

                            <div className={style.title}>select one of the following</div>
                        <div className={style.buttonContainer}>
                        <Button
                            type='secondary'
                            theme={storeContext.theme}
                            height={'45px'}
                            onClick={handleXumm}
                            className={style.button}
                            >import xumm
                             <AngleSmallRight className={style.tick} fill={color} size={12}/>
                        </Button>
                        <Button
                            type='secondary'
                            theme={storeContext.theme}
                            height={'45px'}
                            onClick={handleSeed}
                            className={style.button}
                            >import seed
                            <AngleSmallRight className={style.tick} fill={color} size={12}/>
                        </Button>
                        <Button
                            type='secondary'
                            theme={storeContext.theme}
                            height={'45px'}
                            onClick={handleGenerate}
                            className={style.button}
                            >generate wallet
                             <AngleSmallRight className={style.tick} fill={color} size={12}/>
                        </Button>
                        </div>


                        
                        </div>

                        </div>
                    </div>
                </>
        )
    }

export default NewUser

