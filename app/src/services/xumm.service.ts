import PKCE from 'js-pkce';
import { importBrowser } from './extension.service';

import config from '../../../config'

const xummKey = config.xumm.key 
const redirect = config.xumm.redirect

export const pkce = async ({key, state}: {key?:any, state?:any}) => {

    let browser = await importBrowser();
    const storage = browser ? browser.storage.local : window.localStorage
    const instance = new PKCE({
            client_id: key? key: xummKey,
            redirect_uri: 'http://localhost:3000/auth',
            authorization_endpoint: 'https://oauth2.xumm.app/auth',
            token_endpoint: 'https://oauth2.xumm.app/token',
            requested_scopes: '*',
            storage: storage
        });

        const url = instance.authorizeUrl({state: state? JSON.stringify(state) : null });

        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const width = 400;
        const height = 700;
        window.open(url, 
            "popup", 
            `location=no,width=${width},height=${height},top=0,left=${screenWidth-width},resizable=no`
        );
        return window
}

export const pkceJWT = async (url:string) => {
    //const ebrowser:any = browser.storage.local
    const ebrowser:any = window.localStorage
    const instance = new PKCE({
            client_id: xummKey,
            redirect_uri: redirect,
            authorization_endpoint: 'https://oauth2.xumm.app/auth',
            token_endpoint: 'https://oauth2.xumm.app/token',
            requested_scopes: '*',
            storage: ebrowser
        });

    let resp = await instance.exchangeForAccessToken(url)
    const token = resp.access_token;
    return token

}

export const authenticate = ({state, api}: {state?:string, api?:string}) => {
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) //random string
    const qstring = new URLSearchParams({
        client_id: xummKey,
        redirect_uri: redirect,
        scope: 'somescope',
        response_type: 'token',
        response_mode: 'query',
        state: '',
        nonce: nonce
    })

    window.open(`https://oauth2.xumm.app/auth?${qstring}`)
}
