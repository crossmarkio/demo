import React, {useEffect} from 'react';

import { useScreenContext } from './context'
import directory from './directory'

const ScreenRouter = () => {
        const screenContext = useScreenContext(); 
        let page = screenContext.activePage
        let Element = directory[page]
        return <Element/>
        }

export default ScreenRouter

