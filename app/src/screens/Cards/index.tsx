import React, { useState } from 'react'
import style from './index.module.scss'

import { Placeholder, CreditCard, List} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'

import Bubble from '../../components/Bubble'

import CardElements from '../../containers/CardFactory'

const Cards = () => {

    const storeContext = useStoreContext()
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const [ disp, setDisp ] = useState<boolean>(false)

    return (
                <>
                    <div className={style.inner}>

                        <Header theme={storeContext.theme}/>

                        <TitleBock 
                        page="Cards"
                        theme={storeContext.theme}
                        back="Home"
                        />

                        <div
                            className={style.switchLogo}
                            onClick={() => setDisp(!disp)}
                            >
                                {
                                    !disp 
                                    ? <List fill={color} size={18}/>
                                    : <CreditCard fill={color} size={18}/>
                                }
                        </div>

                        <div className={style.background}></div>

                        <div className={style.foreground}>

                            <div className={style.scroll}>
                                {
                                    !disp 
                                    ? <CardElements/>
                                    : <CardElements type={'list'}/>
                                }
                            </div>
                        </div>

                    <div className={style.nav}>
                        <Bubble/>
                    </div>

                    </div>
                </>
        )
    }

export default Cards

