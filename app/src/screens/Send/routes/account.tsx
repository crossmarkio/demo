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

import CardElements from '../../../containers/CardFactory'

const Account = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const sendContext = useSendContext();

    const [ account, setAccount ] = useState<undefined|string>(undefined)

    const handleBack = () => {
        sendContext.prev()
    }

    const handleSelect = () => {
        sendContext.prev()
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

                                <div className={style.pageTitle}>SELECT ACCOUNT</div>

                                <div className={style.accountContainer}>
                                    <CardElements type={'list'} drawer={false}/>
                                </div>


                                    <div className={style.genericButtonContainer}>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleSelect}
                                            className={style.button}
                                            >select
                                        </Button>
                                    </div>    
                                </div>
                        </div>
                    </div>
                </>
        )
    }

export default Account

