import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useNewContext } from '../context'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { Cross, Check, Envelope, EnvelopeOpen, EnvelopeAdd} from '../../../components/Icons'

import Button from '../../../components/Button'

const Email = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const newContext = useNewContext()

    const handleResend = () => {
        console.log('resend')
    }

    const handleBack = () => {
        screenContext.setPage("Login")
        newContext.setPage("input")
    }

    const color = storeContext.theme == 'light' ? 'black' : 'white'

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
                            <EnvelopeAdd style={{marginTop:'84px'}} stroke={color} size={54}/>
                            <div className={style.logo_title}>CROSSMARK</div>
                            <div className={style.emailText}>
                                <div>{`Congrats ${newContext.data.username}!`}</div>
                                <div>Your account was created.</div>

                                <div className={style.step}>One more step...</div>
                                <p>{`We have sent an email to ${newContext.data.email}. Verify your email to finish setting up your account.`}</p>
                            </div>

                            
                            <div className={style.emailButtonContainer}>
                                <div className={style.button}>
                                    <div className={style.label}>did not receive email?</div>
                                    <Button 
                                        type='primary'
                                        height='45px'
                                        theme={storeContext.theme}
                                        onClick={handleResend}
                                    >
                                    resend email
                                    </Button>
                                </div>

                                <div className={style.button}>
                                    <Button 
                                        type='primary'
                                        height='45px'
                                        theme={storeContext.theme}
                                        onClick={handleBack}
                                    >
                                    back to login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Email

