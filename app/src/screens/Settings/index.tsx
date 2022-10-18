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

import Factory from './factory'

import Router from './router'

import { SettingsIcon, 
    List, 
    Interrogation, 
    Shield, 
    World, 
    SettingsSliders, 
    Star, BookAlt, Physics, ArrowRight, AngleSmallRight  } from '../../components/Icons'

const WalletFactory = lazy(() => import('../../containers/WalletFactory'));


const Settings = () => {

    const storeContext = useStoreContext()


    return (
                <SettingsProvider>
                    <div className={style.inner}>

                    <Header theme={storeContext.theme}/>

                    <TitleBock 
                        
                        theme={storeContext.theme}
                        back="Home"
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>
                            <Factory/>
                        </div>
                        <Router/> 
                    </div>
                    
                </SettingsProvider>
        )
    }

export default Settings


