import React, { useEffect, useState } from 'react';
import './index.scss';
import Sign from './screens/Sign';
import Notification from './screens/Notification';

import { 
    getCurrentWindowId, 
    getManagerObject, 
    isOriginGranted } from './services/extension.service';

export const App = () => {

        const [ manager, setManager ] = useState<any|undefined>(undefined)
        const [ payload, setPayload ] = useState<any|undefined>(undefined)
        const [ access, setAccess ] = useState<any|undefined>(undefined)

        const findPayload = async () => {
            try{
                let manager = await getManagerObject()
                if (manager instanceof Error || !manager) throw Error('manager not found')
                let id = await getCurrentWindowId()
                if (id instanceof Error || !id) throw Error('window id not found')
                let array = Object.keys(manager.payloads)
                let payload = array.map((payload) => {
                    if (manager.payloads[payload].window == id) return manager.payloads[payload]
                }).filter(Boolean)
                let access = await isOriginGranted(manager, payload[0].sender.origin)
                setAccess(access)
                setPayload(payload[0])
            } catch(e) {
                console.log('error', e)
            }
        }

        useEffect(() => {
            findPayload()
        }, [])

        if (!payload) return(
            <div className='inner'>
                This is the popup page... for signing
            </div>
        )

        if (access == false) return (
                <div className='inner'>
                    <Notification 
                        payload={payload} 
                        page={'grant'} 
                        access={setAccess}/>
                </div>
        )

        if (payload.payload['TransactionType'] == 'SignIn'
            && access == true) return (
                <div className='inner'>
                    <Notification 
                        payload={payload} 
                        page={'signin'}  />
                </div>
        )


        return (
            <div className='inner'>
                <Sign request={payload.payload}
                />
            </div>
        )
}

export default App
