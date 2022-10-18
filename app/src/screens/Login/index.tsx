import React, { useRef, useState, useEffect }from 'react'
import style from './index.module.scss'

import { Crossmark } from '../../components/Icons'

import { ReactComponent as BottomSvg } from './../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from './../../assets/svg/waves.svg'

import Button from '../../components/Button'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'
import useRefresh from '../../hooks/useRefresh'

import account from '../../services/account.service'

import Input from '../../components/Input'

const Login = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const [ accessToken, startRefreshTokenTimer ] = useRefresh();

    const [ buttonActive, setButtonActive] = useState<Boolean>(false)

    const userRef = useRef<HTMLInputElement>(null)
    const passRef = useRef<HTMLInputElement>(null)

    const handleChange = (e:React.FocusEvent<HTMLInputElement>) => {
        if ( !userRef.current?.value 
            || !passRef.current?.value ) return setButtonActive(false)
        return setButtonActive(true)
    }

    useEffect(() => {
        console.log('refreshing')
        if ( userRef.current?.value 
            && passRef.current?.value 
       ) return setButtonActive(true)
       if (buttonActive) return setButtonActive(false)
    })


    const handleLogin = async  () => {
        if ( !userRef.current?.value || !passRef.current?.value) return
        let response:any = await account.authenticate({ user:userRef.current.value, pass:passRef.current.value })
        if ( response instanceof Error) return console.log(response.message)
        startRefreshTokenTimer( response.jwtToken )
        screenContext.setUser({ username:response.username, 
                                id:response.id, 
                                accessToken:response.jwtToken })
        screenContext.setPage('Home')
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
                            <div className={style.logoContainer}>
                                    <div className={style.title}>
                                        <Crossmark stroke={color} size={48}/>
                                        <div>CROSSMARK</div>
                                    </div>
                                    <div className={style.subtitle}>a digital wallet</div>
                            </div>

                            <div className={style.buttonContainer}>
                                
                                <Input
                                    ref={userRef}
                                    className={style.input}
                                    type='text'
                                    placeholder='enter username'
                                    label='username'
                                    onChange={handleChange}
                                />

                                <Input
                                    ref={passRef}
                                    className={style.input}
                                    type='password'
                                    placeholder='enter password'
                                    label='password'
                                    onChange={handleChange}
                                >
                                    <div className={style.forgot}>forgot password?</div>
                                </Input>


                            <div className={buttonActive ? null : style.disable}>
                                <Button 
                                    type='secondary'
                                    theme={storeContext.theme}
                                    height={'45px'}
                                    onClick={handleLogin}
                                    className={style.button}
                                    > 
                                    login
                                    </Button>
                            </div>
                            <div className={style.noAccount}
                            onClick={() => screenContext.setPage("NewUser")}>
                                dont have an account? sign up</div>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Login

