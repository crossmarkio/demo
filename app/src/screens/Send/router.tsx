import React, {useEffect} from 'react';

import { useSendContext } from './context'
import directory from './directory'

const SettingsRouter = () => {
        const addContext = useSendContext(); 
        let page = addContext.activePage
        if (page == 'unset') return null
        if (!page) return null
        let Element = directory[page]

        return <Element/>
        }

export default SettingsRouter

