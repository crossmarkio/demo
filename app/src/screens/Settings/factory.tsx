import React, {Suspense, lazy, useState} from 'react'
import style from './index.module.scss'

import { Placeholder, Add,Plus} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import AssetListFactory from '../../containers/AssetListFactory'
import TokenListFactory from '../../containers/TokenListFactory'

import SettingsProvider from './context'
import { useSettingsContext } from './context'

import Router from './router'

import { SettingsIcon, 
    List, 
    Interrogation, 
    Shield, 
    World, 
    SettingsSliders, 
    Star, BookAlt, Physics, ArrowRight, AngleSmallRight  } from '../../components/Icons'


const sections = [
'accounts',
'',
'general',
'address book',
'',
'security',
'advanced',
'',
'support',
'terms + conditions',
'credits'
]

const icons = [
    <List size={20}/>,
    '',
    <SettingsSliders size={20}/>,
    <BookAlt size={20}/>,
    '',
    <Shield size={20}/>,
    <Physics size={20}/>,
    '',
    <Interrogation size={20}/>,
    <World size={20}/>,
    <Star size={20}/>
]

const Factory = () => {

    const storeContext = useStoreContext()
    const settingsContext = useSettingsContext()

    const [state, setState] = useState('assets') 
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleClick = (section:string) => {
        if (section == 'terms + conditions') return settingsContext.setPage('terms')
        if (section == 'address book') return settingsContext.setPage('book')
        return settingsContext.setPage(section)
    }


    let iconColor = storeContext.theme == "light" ? 'rgb(2, 2, 2)' : 'rgb(247, 247, 247)';
    
    const icons = [
        <List size={20} color={iconColor}/>,
        '',
        <SettingsSliders size={20} color={iconColor}/>,
        <BookAlt size={20} color={iconColor}/>,
        '',
        <Shield size={20} color={iconColor}/>,
        <Physics size={20} color={iconColor}/>,
        '',
        <Interrogation size={20} color={iconColor}/>,
        <World size={20} color={iconColor}/>,
        <Star size={20} color={iconColor}/>
    ]
    

    return (
            <>
                { sections.map((section, index) => {
                    if (section == '') return <div className={style.divider}></div>
                    return (<div className={style.section} onClick={() => handleClick(section)}>
                        {icons[index]}
                        <div>{section}</div>
                        <AngleSmallRight 
                            size={16} 
                            color={iconColor}/>
                        </div>)
                    }
                )}
            </>
        )
    }

export default Factory


