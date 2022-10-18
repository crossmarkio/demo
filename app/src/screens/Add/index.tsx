import React, {Suspense, lazy, useState} from 'react'
import style from './index.module.scss'


import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import AddProvider from './context'
import { useAddContext } from './context'

import Router from './router'

const Add = () => {

    const storeContext = useStoreContext()

    return (
                <AddProvider>
                    <div className={style.inner}>
                        <div className={style.background}></div>
                        <Router/> 
                    </div>
                </AddProvider>
        )
    }

export default Add


