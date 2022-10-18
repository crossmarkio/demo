import React, {Suspense, lazy, useState} from 'react'
import style from '../index.module.scss'


import Header from '../../../components/Header'
import TitleBock from '../../../components/TitleBlock'
import { useStoreContext } from '../../../store/store'
import { useSettingsContext } from '../context'

import { SettingsIcon, 
    List, 
    Interrogation, 
    Shield, 
    World, 
    SettingsSliders, 
    Star, BookAlt, Physics, ArrowRight, AngleSmallRight  } from '../../../components/Icons'

    const sections = [
        'select chain',
        'change node',
        'developer mode'
    ]


const Advanced = () => {

    const storeContext = useStoreContext()
    const settingsContext = useSettingsContext()

    const [state, setState] = useState('assets') 
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleClick = (section:string) => {
        if (section == 'change node') return settingsContext.setPage('nodes')
        if (section == 'address book') return settingsContext.setPage('book')
        return settingsContext.setPage(section)
    }

    let iconColor = storeContext.theme == "light" ? 'rgb(2, 2, 2)' : 'rgb(247, 247, 247)';
    
    return (
                <>
                    <div className={style.route}>

                    <Header theme={storeContext.theme}/>

                    <TitleBock 
                        theme={storeContext.theme}
                        back= {'unset'}
                        context= {settingsContext}
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>

                            <div className={style.title}>{'Advanced'}</div>
                            { sections.map((section, index) => {
                                return <div className={style.section}
                                onClick={() => handleClick(section)}
                                >
                                    <div>{section}</div>
                                    {
                                        section == 'developer mode' ? null :
                                        <AngleSmallRight 
                                        size={16} 
                                        color={iconColor}/>
                                    }

                                </div>
                            })} 
                        </div>
                    </div>
                </>
        )
    }

export default Advanced


