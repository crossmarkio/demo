import { Client, rippleTimeToUnixTime } from 'xrpl'
import { 
    DEFAULT_HOOKSNET, 
    DEFAULT_MAINNET, 
    DEFAULT_NFTDEV, 
    DEFAULT_TESTNET, 
    DEFAULT_DEVNET } from '../constants/networks'


const init = async (url:string) => {
    return new Client(url)
}

const connect = (api:Client) => {
    return new Promise( async (resolve, reject) => {
        await api.connect();
        resolve('connected');
    })
}

const disconnect = (api:Client) => {
    return new Promise( async (resolve, reject) => {
        await api.disconnect();
        resolve('disconnected');
    })
}

const request = (api:Client,request: any) => {
    return new Promise( async (resolve, reject) => {
        let response = await api.request(request)
        resolve(response)
    })
}

const on = (api:Client, event:any, fn:any) => {
    api.on(event, fn)
}

export {
    init, 
    connect, 
    disconnect, 
    request,
    on
}