import React, {useEffect, useState, Suspense, lazy} from 'react'
import style from '../screens/Dashboard/index.module.scss'

import { useStoreContext } from '../store/store'
import { useScreenContext } from '../screens/context'

import oracleService from '../services/oracle.service'


interface IAsset {
    currency: string
    value: string
    issuer?:string
  }


interface IWallet {
    name: string
    key: string
    color:string
}

interface ICurrency {
    currency: string
    value: string
    issuer?:string
}

const tickers = [
    ["BTC_USD","BTC_USDT","BTC_USDC","BTC_BUSD"],
    ["XRP_USD","XRP_USDT","XRP_USDC","XRP_BUSD"],
    ["ETH_USD","ETH_USDT","ETH_USDC","ETH_BUSD"],
    ["XLM_USD","XLM_USDT","XLM_USDC","XLM_BUSD"],
    ["DOGE_USD","DOGE_USDT","DOGE_USDC","DOGE_BUSD"],
    ["LTC_USD","LTC_USDT","LTC_USDC","LTC_BUSD"]
]

const ChartComponent = lazy(() => import('../components/Charts/lineChart'));

const ChartFactory = (ticker:any, i:number, token:string|undefined) => {
        const [ data, setData ] = useState<any>(undefined) 

        const fetch = async (ticker:any, i:number, token:string|undefined) => {
            let prices = await fetchPrices(ticker, i, token)
            console.log(prices)
            setData(prices)
        }
        
        useEffect(() => { fetch(ticker, i, token )}, [])

        if (data == undefined) return <div>'Loading...'</div>
        return (
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <div>{
                        data == undefined 
                        ? null 
                        : `$ ${data[data.length-1].close}`}
                    </div>
                    <ChartComponent key={i} data={data}/>
                </Suspense>
            </div>
    );
}

const fetchPrices = async (ticker:any, i:number, token:string|undefined) => {
    if (!token) return
    const prices = await oracleService.getTimeSeries(
            {   tickers: ticker,
                interval: 30,
                unit: "minute",
                page: 5,
                range: ["undefined", "undefined"] 
            }, token)

    return prices
}

const Markets = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    return (
        <>
            { tickers
                .map((ticker, i) => 
                    <div>
                        <div>{`${ticker[0].split("_")[0]}/${ticker[0].split("_")[1]}`}</div>
                        <div></div>
                        { ChartFactory(
                            ticker,
                            i, 
                            screenContext.user?.accessToken 
                        )}
                    </div>
                )
            }
        </>
    );
}

export default Markets