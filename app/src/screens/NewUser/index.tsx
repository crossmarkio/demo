import React, {Suspense, lazy, useState} from 'react'
import style from './index.module.scss'


import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import NewProvider from './context'
import { useNewContext } from './context'

import Router from './router'

const NewUser = () => {

    const storeContext = useStoreContext()

    return (
                <NewProvider>
                    <div className={style.inner}>
                        <div className={style.background}></div>
                        <Router/> 
                    </div>
                </NewProvider>
        )
    }

export default NewUser


