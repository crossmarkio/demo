import React, { useEffect } from 'react'
import style from './index.module.scss'

import { Placeholder} from '../../components/Icons'

import Bubble from '../../components/Bubble'

import Button from '../../components/Button'
import Header from '../../components/Header'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import MarketElements from '../../containers/MarketsFactory'
import TitleBlock from '../../components/TitleBlock'

import browser from 'webextension-polyfill'


const apps = [
    {name:'bithomp',
    url: 'https://bithomp.com'},
    {name:'xumm',
    url: 'https://xumm.app'},
    {name:'xrpl.org',
    url: 'https://xrpl.org'},
    {name:'xrplmeta',
    url: 'https://xrplmeta.org/'},
    {name:'sologenic',
    url: 'https://sologenic.org/trade'},
    {name:'onthedex',
    url: 'https://onthedex.live/'},
    {name:'xrpltoolkit',
    url: 'https://www.xrptoolkit.com/'},
    {name:'mintagram',
    url: 'https://mintagram.whirled.io'}
]

const Apps = () => {

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
                        page="Apps"
                        theme={storeContext.theme}
                        back="Home"
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>
                        <div className={style.scroll}>
                            <div className={style.grid}>
                                { apps.map((app) => 
                                            <div className={style.app}
                                            onClick={() => window.open(app.url)}>
                                                <img src={`${app.url}/favicon.ico`} alt="" height={'60%'}/>
                                            </div>
                                )}
                            </div>
                            </div>
                        </div>
                        <div className={style.nav}>
                            <Bubble/>
                        </div>
                    </div>
                </>
        )
    }

export default Apps

