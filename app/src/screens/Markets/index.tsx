import React, { useEffect } from 'react'
import style from './index.module.scss'

import { Placeholder} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import MarketElements from '../../containers/MarketsFactory'
import TitleBlock from '../../components/TitleBlock'

const Markets = () => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const handleNavClick = (page:string) => {
        screenContext.setPage(page)
    }

    return (
                <>
                    <div className={style.inner}>

                        <Header theme={storeContext.theme}/>

                        <TitleBlock 
                        page="Markets"
                        theme={storeContext.theme}
                        back="Home"
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>
                            <div className={style.profileContainer}>
                                <MarketElements/>
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default Markets

