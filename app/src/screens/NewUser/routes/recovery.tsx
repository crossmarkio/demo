import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { Cross, Check} from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useNewContext } from '../context'

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'

import { generateRandomMnuemonic, generateSeedFromMnuemonic} from '../../../lib/utils/crypto'


interface ICheck  {
    status: Boolean
    msg:string|null
}

const Recovery = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const newContext = useNewContext();

    const phrase = generateRandomMnuemonic()

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleProceed = async () => {
        console.log('clicked')

        let temp = newContext.data
        let seed = await generateSeedFromMnuemonic(phrase)
        temp.recovery = seed

        newContext.setData(temp)
        newContext.setPage('terms')
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
                            <div className={style.logoContainer} style={{'margin':'0px'}}>
                                <div className={style.title}>
                                    <Crossmark stroke={color} size={48}/>
                                    <div>CROSSMARK</div>
                                </div>
                                <div className={style.subtitle}>crossmark recovery phrase</div>
                            </div>
                                <p className={style.description}>Here is your account recovery phrase. This will be used to encrypt sensitive information stored on your device.</p>

                                <div className={style.command}>write down + keep safe  + keep private</div>

                                <div className={style.recoveryContainer}>
                                {
                                    phrase.split(' ').map((phrase, index) => 
                                    <div className={style.wrapper}>
                                        <div className={style.number}>{index+1}</div> 
                                        <div className={style.phrase}>{phrase}</div> 
                                    </div>
                                    )
                                }
                                </div>

                            


                            <div className={style.buttonContainer}>
                                    <Button 
                                        type='primary'
                                        theme={storeContext.theme}
                                        height={'45px'}
                                        onClick={handleProceed}
                                        className={style.button}
                                        > 
                                        proceed
                                    </Button>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Recovery

