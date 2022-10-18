import React from 'react';
import ScreenRouter from './router'
import style from "./index.module.scss"
import ScreenProvider from './context'
import Cursor from '../components/Cursor';

export const Screen = () => 
    <ScreenProvider>
        <div className={style.inner}>
                <ScreenRouter/> 
        </div>
    </ScreenProvider>

export default Screen
