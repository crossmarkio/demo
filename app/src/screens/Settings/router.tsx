import React, {useEffect} from 'react';

import { useSettingsContext } from './context'
import directory from './directory'

const SettingsRouter = () => {
        const settingsContext = useSettingsContext(); 
        let page = settingsContext.activePage
        if (page == 'unset') return null
        if (!page) return null
        let Element = directory[page]

        return <Element/>
        }

export default SettingsRouter

