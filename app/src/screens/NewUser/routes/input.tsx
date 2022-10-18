import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'

import { Cross, Check} from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useNewContext } from '../context'

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'

interface ICheck  {
    status: Boolean
    msg:string|null
}

const NewUser = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const newContext = useNewContext();

    const [ accessToken, startRefreshTokenTimer ] = useRefresh();

    const [ buttonActive, setButtonActive] = useState<Boolean>(false)

    const [ emailCheck , setEmailCheck ] = useState<ICheck | undefined>(undefined)
    const [ usernameCheck , setUsernameCheck ] = useState<ICheck | undefined>(undefined)
    const [ passCheck , setPassCheck ] = useState<ICheck| undefined>(undefined)

    const userRef = useRef<HTMLInputElement>(null)
    const passRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const repeatRef = useRef<HTMLInputElement>(null)

    const handleChange = (e:React.FocusEvent<HTMLInputElement>) => {
        if (!passRef.current?.value 
            || !repeatRef.current?.value
            || passRef.current?.value ==''
            || repeatRef.current?.value=='' ) return setPassCheck(undefined)
        if ( e.target.autocomplete == 'new-password' 
             || e.target.autocomplete == 'current-password') {
                if (passRef.current?.value == repeatRef.current?.value ) {

                    //Check password format
                    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g;
                    let results = e.target.value.match(re)
                    if (!results) return setPassCheck({status:false, msg: 'Password must be at least 6 characters, no more than 20 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.'})

                    setPassCheck({status:true, msg: null})
                }
                if (passRef.current?.value != repeatRef.current?.value ) setPassCheck(undefined)
        }   
    }

    useEffect(() => {
        if ( userRef.current?.value 
            && passRef.current?.value 
            && emailRef.current?.value 
            && repeatRef.current?.value 
            && emailCheck?.status
            && usernameCheck?.status
            && passCheck?.status
       ) return setButtonActive(true)
       if (buttonActive) return setButtonActive(false)
    })

    const handleCreate = async  () => {
        console.log('clicked')

        if ( !userRef.current?.value 
            && !passRef.current?.value 
            && !emailRef.current?.value 
            && !repeatRef.current?.value 
            && !emailCheck?.status
            && !usernameCheck?.status
            && !passCheck?.status
       ) return console.log('something went wrong')
        let data = {
            username: userRef.current?.value,
            email: emailRef.current?.value ,
            password: passRef.current?.value,
            confirmPassword: repeatRef.current?.value,
        }
        newContext.setData(data)
        newContext.setPage('recovery')
    }

    const handleFocus = (e:React.FocusEvent<HTMLInputElement>)  => {
    }

    const handleUnfocus = async (e:React.FocusEvent<HTMLInputElement>)  => {
        let res;
        if (e.target.autocomplete == 'email') {
            if (!e.target.value) return setEmailCheck(undefined)

            //Check email format
            let re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g;
            let results = e.target.value.match(re)
            if (!results) return setEmailCheck({status:false, msg: 'invalid email format'})

            res = await accountService.checkEmail({email:e.target.value})
            if (!res.exists) return setEmailCheck({status:true, msg: null})
            if (res.exists) return setEmailCheck({status:false, msg: 'email already registered'})
        }

        if (e.target.autocomplete == 'username') {
            if (!e.target.value) return setUsernameCheck(undefined)

                //Check username format
                let re = /^[a-zA-Z0-9-]{3,}$/g;
                let results = e.target.value.match(re)
                if (!results) return setUsernameCheck({status:false, msg: 'Username must be at least 3 characters and may only include alphanumeric expressions and dashes'})
                

            res = await accountService.checkUsername({username:e.target.value})
            if (!res.exists) return setUsernameCheck({status:true, msg: null})
            if (res.exists) return setUsernameCheck({status:false, msg: 'username taken. try a new one'})
        }

        if (e.target.autocomplete == 'new-password' || e.target.autocomplete == 'current-password') {
            if (!repeatRef.current?.value || !passRef.current?.value) return setPassCheck(undefined)
            if (!e.target.value) return setPassCheck(undefined)
            if (repeatRef.current?.value == passRef.current?.value) {
                //Check password format
                let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/g;
                let results = e.target.value.match(re)
                if (!results) return setPassCheck({status:false, msg: 'Password must be at least 6 characters, no more than 20 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.'})
                
                return setPassCheck({status:true, msg: null})
            }
            if (repeatRef.current?.value != passRef.current?.value) return setPassCheck({status:false, msg: 'passwords do not match!'})
        }
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
                                <div className={style.subtitle}>new account</div>
                            </div>


                            <div className={style.buttonContainer}>

                                <Input
                                        ref={emailRef}
                                        className={`${style.input}`}
                                        type='email'
                                        placeholder='enter email'
                                        label='email'
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onUnfocus={handleUnfocus}
                                    >
                                    <div className={style.indication}>
                                        { emailCheck?.status == false
                                            ? <Cross size={10} fill={'red'}/> :
                                            emailCheck?.status == true ? <Check size={10} fill={'green'}/> 
                                            : null
                                        }
                                    </div>
                                    { emailCheck?.status == false
                                        ? <div className={style.note}>{emailCheck?.msg}</div>
                                        : <div className={style.note}></div>
                                    }
                                    </Input>

                                <Input
                                    ref={userRef}
                                    className={style.input}
                                    type='text'
                                    placeholder='enter username'
                                    label='username'
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onUnfocus={handleUnfocus}
                                >
                                <div className={style.indication}>
                                        { usernameCheck?.status == false
                                            ? <Cross size={10} fill={'red'}/> :
                                            usernameCheck?.status == true ? <Check size={10} fill={'green'}/> 
                                            : null
                                        }
                                </div>
                                { usernameCheck?.status == false
                                    ? <div className={style.note}>{usernameCheck?.msg}</div>
                                    : <div className={style.note}></div>
                                }
                                </Input>
                                
                                <Input
                                    ref={passRef}
                                    className={style.input}
                                    type='password'
                                    placeholder='enter password'
                                    label='password'
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onUnfocus={handleUnfocus}
                                >
                                <div className={style.indication}>
                                        { passCheck?.status == false
                                            ? <Cross size={10} fill={'red'}/> :
                                            passCheck?.status == true ? <Check size={10} fill={'green'}/> 
                                            : null
                                        }
                                </div>
                                </Input>

                                <Input
                                    ref={repeatRef}
                                    className={style.input}
                                    type='password'
                                    placeholder='repeat password'
                                    label='repeat password'
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onUnfocus={handleUnfocus}
                                >
                                <div className={style.indication}>
                                        { passCheck?.status == false
                                            ? <Cross size={10} fill={'red'}/> :
                                            passCheck?.status == true ? <Check size={10} fill={'green'}/> 
                                            : null
                                        }
                                </div>
                                    { passCheck?.status == false
                                        ? <div className={style.note}>{passCheck?.msg}</div>
                                        : <div className={style.note}></div>
                                    }
                                </Input>



                                <div className={buttonActive ? null : style.disable}>
                                    <Button 
                                        type='primary'
                                        theme={storeContext.theme}
                                        height={'45px'}
                                        onClick={handleCreate}
                                        className={style.button}
                                        > 
                                        continue
                                    </Button>
                                </div>
                                <div className={style.hasAccount}
                                    onClick={() => screenContext.setPage("Login")}>
                                    already have an account? sign in
                                </div>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default NewUser

