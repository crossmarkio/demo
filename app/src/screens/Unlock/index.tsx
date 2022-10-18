import React from 'react'
import style from './index.module.scss'

import { Crossmark } from '../../components/Icons'

import { ReactComponent as BottomSvg } from '../../assets/svg/lines-bottom.svg'
import { ReactComponent as TopSvg } from '../../assets/svg/lines-top.svg'

import Button from '../../components/Button'
import { useStoreContext } from '../../store/store'

import Input from '../../components/Input'

const Unlock = () => {
    const storeContext = useStoreContext()
    return (
                <>
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
                            <div className={style.logoContainer}>
                                <Crossmark fill={'white'} size={94}/>
                                <div className={style.title}>crossmark</div>
                                <div className={style.subtitle}>a digital wallet</div>
                            </div>

                            <div className={style.welcomeContainer}>
                                <div className={style.title}>welcome back</div>
                                <div className={style.subtitle}>intercoder</div>
                            </div>


                            <div className={style.buttonContainer}>
                                <Button 
                                    type='secondary'
                                    theme={storeContext.theme}
                                    onClick={() => console.log('clicked')}
                                    >
                                    unlock</Button>
                            </div>
                        </div>
                    </div>
                </>
        )
    }

export default Unlock

