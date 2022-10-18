import axios from 'axios';
import config from '../../../config'

axios.defaults.baseURL = config.api.url

interface ITimeSeries {
    tickers: Array<string>
    interval: number
    unit: string
    page: number
    range: Array<string>
}

const getTimeSeries = async ( params:ITimeSeries, jwt:string) => {
    try{
        let response = await axios.post(`/oracle/time-series`, 
        JSON.stringify(params),
        {   withCredentials: true, 
            headers: { 
                'Authorization': `Bearer ${jwt}`, 
                'Content-Type': 'application/json', 
            }})
        return response.data
    } catch(error:any) {
        return Error(error.response.data.message)
    }
}


export default {
    getTimeSeries
}