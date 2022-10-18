import React, {Suspense, lazy, useState} from 'react'
import style from './index.module.scss'


import Header from '../../components/Header'
import TitleBock from '../../components/TitleBlock'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import NotificationProvider from './context'
import { useNotificationContext } from './context'

import Router from './router'

const Notification = (props:any) => {

    const storeContext = useStoreContext()
    
    return (
                <NotificationProvider>
                    <div className={style.inner}>
                        <Router data={props}/> 
                    </div>
                </NotificationProvider>
        )
    }

export default Notification
