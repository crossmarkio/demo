import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { ArrowLeft } from '../../../components/Icons'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useSendContext } from '../context'
import { useAuthContext } from '../../../store/auth';

import accountService from '../../../services/account.service'
import XummComponent from '../../../components/Xumm'

const Xumm = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const sendContext = useSendContext();

    const [ status, setStatus ] = useState<any>(undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleBack = () => {
        sendContext.setPage("input")
    }

    const handleSignIn = async (status:any) => { 
        let obj = {
            wallet: {
                "key": status.response.response.account,
                "method": "xumm",
            },
            accounnt:null
        }

        sendContext.setData(obj)
        sendContext.setPage("keyname")  
    }

    useEffect(() => {
        if (status == undefined) return
        if (status.state == 'signed') handleSignIn(status)
    }, [status])

    return (
                <>
                    <div className={style.inner}>

                        <div className={style.background}>
                            <div className={`${style.absolute} ${style.tl}`}>
                                <TopSvg width={400} height={'100%'}/>
                            </div>
                            <div className={`${style.absolute} ${style.br}`}>
                                <BottomSvg width={400} height={'100%'}/>
                            </div>
                        </div>

                        <div className={style.foreground}>

                            <div className={style.container}>

                            <div className={style.back} onClick={handleBack}>
                                <ArrowLeft fill={color} size={28}/>
                            </div>

                            <div className={style.logo}>
                                <Crossmark stroke={color} size={36}/>
                                <div className={style.pageTitle}>ADD WALLET</div>
                            </div>
                                
                            <XummComponent
                                    size={250}
                                    request={{"TransactionType":"SignIn"}}
                                    baseUrl={'http://localhost:4001'}
                                    route={''}
                                    xumm_api_key={'e0b87014-e090-4d33-994a-2a7fab723e07'}
                                    header={false}
                                    setState={setStatus}
                                />
                        </div>

                        </div>
                    </div>
                </>
        )
    }

export default Xumm

