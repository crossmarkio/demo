import React, {useEffect} from 'react';

import { useNotificationContext } from './context'
import directory from './directory'

const NotificationRouter = (props:any) => {
        const notificationContext = useNotificationContext(); 

        if(props.data.page) {
                let Element = directory[props.data.page]
                return <Element data={props.data}/>
        }

        let page = notificationContext.activePage
        if (page == 'unset') return null
        if (!page) return null
        let Element = directory[page]

        return <Element data={props.data}/>
}

export default NotificationRouter

