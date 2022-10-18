import React, { useEffect, useState } from 'react';
import './index.scss';
import { emitMessage } from './services/extension.service';

//import browser, { browserSettings, Cookies } from "webextension-polyfill";

import { pkceJWT } from './services/xumm.service';

export const Auth = () => {

        const getJWT = async () => {
            let token = await pkceJWT(window.location.href)
            let target = window.opener
            let state = window.localStorage.getItem('pkce_state');
            console.log(state)
            let parsedState = state ?  JSON.parse(state) : null
            let data = {
                id: parsedState.id,
                key:parsedState.key,
                jwt:token
            }
            let response = await emitMessage(data, target)
            if (response) window.close()
        }

        useEffect(() => {
            getJWT()
        }, [])

        return (
            <div className='inner'></div>
        )
}

export default Auth
