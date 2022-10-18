import React from 'react'
import style from './index.module.scss'

import { Crossmark } from '../../components/Icons'

import { ReactComponent as BottomSvg } from './../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from './../../assets/svg/waves.svg'

import Button from '../../components/Button'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'
import LogoAnimation from '../../components/Animations/logo/logo'
import InsetLogoAnimation from '../../components/Animations/logo/inset'

const Landing = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const handleNavClick = (page:string) => {
        screenContext.setPage(page)
    }

    const color = storeContext.theme == 'light' ? 'black' : 'white';

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
                                <LogoAnimation size={76}/>
                                <div className={style.inset}>
                                    <InsetLogoAnimation size={76}/>
                                </div>
                                <div className={style.title}>CROSSMARK</div>
                                <div className={style.subtitle}>unleashing interactive money</div>
                            </div>

                            <div className={style.buttonContainer}>
                                <Button 
                                    type='primary'
                                    theme={storeContext.theme}
                                    height={'45px'}
                                    onClick={() => handleNavClick("NewUser")}
                                    className={style.button}
                                    >
                                        create an account</Button>
                                <Button 
                                    type='secondary'
                                    theme={storeContext.theme}
                                    height={'45px'}
                                    onClick={() => handleNavClick("Login")}
                                    className={style.button}
                                    >
                                    login
                                    </Button>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Landing

