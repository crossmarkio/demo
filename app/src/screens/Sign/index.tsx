import React, {lazy, Suspense} from 'react'
import style from './index.module.scss'

import { ReactComponent as BottomSvg } from '../../assets/svg/lines-bottom.svg'
import { ReactComponent as TopSvg } from '../../assets/svg/lines-top.svg'

import { useScreenContext } from '../context'

import XummComponent from '../../components/Xumm'

interface IProps {
    request?:any
}

const Sign = ({request}:IProps) => {

    const screenContext = useScreenContext()

    return (
                    <div className={style.inner}>
                        <div className={style.background}>
                                <div className={`${style.absolute} ${style.tl}`}>
                                    <TopSvg width={366} height={407}/>
                                </div>
                                <div className={`${style.absolute} ${style.br}`}>
                                    <BottomSvg width={400} height={445}/>
                                </div>
                            </div>

                            <div className={style.foreground}>
                                <div className={style.container}>
                                    <XummComponent
                                        size={200}
                                        request={request}
                                        baseUrl={'http://localhost:4001'}
                                        route={''}
                                        xumm_api_key={'e0b87014-e090-4d33-994a-2a7fab723e07'}
                                        header={true}
                                    />
                            </div>
                        </div>
                    </div>
        )
    }

export default Sign

