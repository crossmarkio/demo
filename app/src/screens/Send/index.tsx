import React, {Suspense, lazy, useState} from 'react'
import style from './index.module.scss'


import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import SendProvider from './context'

import Router from './router'

const Send = () => {

    const storeContext = useStoreContext()

    return (
                <SendProvider>
                    <div className={style.inner}>
                        <div className={style.background}></div>
                        <Router/> 
                    </div>
                </SendProvider>
        )
    }

export default Send


