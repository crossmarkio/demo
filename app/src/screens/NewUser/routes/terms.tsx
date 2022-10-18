import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import useRefresh from '../../../hooks/useRefresh'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { useNewContext } from '../context'

import Button from '../../../components/Button'
import accountService from '../../../services/account.service'

const Terms = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const newContext = useNewContext();

    const [ buttonActive, setButtonActive] = useState<Boolean>(false)

    const handleTerms = async () => {
        let temp = newContext.data
        temp.acceptTerms = true
        let response = await accountService.register(temp)
        if (response instanceof Error) return
        newContext.setData({username:temp.username, email:temp.email})
        newContext.setPage('email')
    }

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
                    <div className={style.termsTitle}>Terms of Service</div>
                        <div className={style.container}>
                        <div className={style.title}>Terms of Service</div>
                        <div className={style.title}>Introduction</div>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                        <div className={style.title}>Title</div>    
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                        <div className={style.title}>Title</div>    
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad libero, earum debitis doloribus voluptates dolores modi quidem quasi explicabo. Deserunt, in? Expedita quas, quos exercitationem quasi id iure eaque itaque.</p>
                        </div>  
                        <div className={style.emailButtonContainer}>
                            <Button 
                                type='primary'
                                theme={storeContext.theme}
                                onClick={handleTerms}
                                height={'45px'}
                                className={style.button}
                                > 
                                continue
                            </Button>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Terms

