import React, {useEffect} from 'react';

import { useNewContext } from './context'
import directory from './directory'

const SettingsRouter = () => {
        const newContext = useNewContext(); 
        let page = newContext.activePage
        if (page == 'unset') return null
        if (!page) return null
        let Element = directory[page]

        return <Element/>
        }

export default SettingsRouter

