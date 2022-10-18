import axios from 'axios'
import config from '../../../../config'

const apiEndPoint = '';
axios.defaults.baseURL = config.api.url
const xummKey = config.xumm.key


const init = async () =>  {
    try {
        const auth = await axios.get(`${apiEndPoint}/xumm/init`, { headers: {'x-api-key':xummKey} })
        let jwt = auth.data;
        return jwt
    } catch(e) {
        if (e === '') throw { msg: 'closed', error: false }
        throw e
    }
}

const headers = (jwt:boolean|string) => {
    return { headers: { Authorization: jwt, 'x-api-key': xummKey } }
}

const getTokenData = async (ott:string) => {
    try {
        const res = await axios.get(`${apiEndPoint}/xapp/ott/${ott}`, headers(true))
        let tokenData = res.data
        return tokenData
    } catch(e) {
        throw 'Error getting Token Data'
    }
}

const accessToken = async (ott:string, jwt:string) => {
    if(jwt) return jwt
    else {
        let tokenData = await getTokenData(ott)
        let jwt = tokenData.token
        return jwt
    }
}

const payload = async (payload:any, jwt:string) => {
    try {
        const res = await axios.post(`${apiEndPoint}/xumm/payload`, payload, headers(jwt))
        return res;
    } catch(e) {
        if (e === '') throw { msg: 'closed', error: false }
        throw e
    }
}

const getMetadata = async (uuid:string) => {
    try {
        const res = await axios.get(`${apiEndPoint}/xumm/meta/${uuid}`,{ headers: {'x-api-key':xummKey}})
        return res;
    } catch(e) {
        if (e === '') throw { msg: 'closed', error: false }
        throw e
    }
}

const openWebSocket = (url:string) => {
        const ws = new WebSocket(url);
        return ws
    };

const scannedWebSocket = async (ws:WebSocket) => {
    return new Promise((resolve,reject) => {
        ws.onmessage = function(event) {
            const resp = JSON.parse(event.data);
            console.log(resp, 'scanned')
            if(resp.signed == false) {
                ws.close();
                resolve(new Error("Sign rejected, try again :P"))
            } else if (Object.keys(resp).indexOf('opened') > -1){
                resolve({message: "QR Code scanned, waiting for your approval :P"})
            }
        }
    })
};

const signedWebSocket = async (ws:WebSocket) => {
    return new Promise((resolve,reject) => {
        ws.onmessage = function(event) {
            const resp = JSON.parse(event.data);
            console.log(resp)
            if(resp.signed == false) {
                ws.close();
                resolve(new Error("Sign rejected, try again :P"))
            } else if(resp.signed == true) {
                    const data = {
                        type:"signed",
                        response:resp,
                        uuidPayload :resp.payload_uuidv4,
                        uuidCall :resp.reference_call_uuidv4,                    
                    }

                    resolve({message:"Sign fulfilled :P", data: data})
                    ws.close();
                }
            }
    })
};

export default {
    payload,
    getMetadata,
    init,
    accessToken,
    getTokenData,
    openWebSocket,
    scannedWebSocket,
    signedWebSocket
}