import React from 'react'
import style from './index.module.scss'

import { Placeholder} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import { useStoreContext } from '../../store/store'

import TitleBlock from '../../components/TitleBlock'
import Chart from '../../containers/ChartFactory'
import Portfolio from '../../containers/PortfolioFactory'

import Bubble from '../../components/Bubble'

const Dashboard = () => {

    const storeContext = useStoreContext()

    return (
                <>
                    <div className={style.inner}>

                    <Header theme={storeContext.theme}/>

                    <TitleBlock 
                    page="Dashboard"
                    theme={storeContext.theme}
                    back="Home"
                    />
                       
                    <div className={style.foreground}>
                        <Portfolio/>
                    </div>

                    <div className={style.nav}>
                                <Bubble/>
                        </div>
                </div>
            </>
        )
    }

export default Dashboard

