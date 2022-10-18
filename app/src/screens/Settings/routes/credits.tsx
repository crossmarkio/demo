import React, {Suspense, lazy, useState} from 'react'
import style from '../index.module.scss'


import Header from '../../../components/Header'
import TitleBock from '../../../components/TitleBlock'
import { useStoreContext } from '../../../store/store'
import { useSettingsContext } from '../context'


const Index = () => {

    const storeContext = useStoreContext()
    const settingsContext = useSettingsContext()

    const [state, setState] = useState('assets') 
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleClick = (section:string) => {
        console.log(section)
    }

    let iconColor = storeContext.theme == "light" ? 'rgb(2, 2, 2)' : 'rgb(247, 247, 247)';
    
    return (
                <>
                    <div className={style.advanced}>

                    <Header theme={storeContext.theme}/>

                    <TitleBock 
                        theme={storeContext.theme}
                        back= {'unset'}
                        context= {settingsContext}
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>

                            {'Credits'}
{/*                             { networks.map((network, index) => {
                                for (let i =0; i<network.length; i++) {
                                    if (i == 0) return <div className={style.divider}></div>
                                    return <div className={style.section}>{network[i]}</div>
                                }
                            })} */}
                        </div>
                    </div>
                </>
        )
    }

export default Index

