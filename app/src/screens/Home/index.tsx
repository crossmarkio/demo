import React, { useEffect, useState } from 'react'
import style from './index.module.scss'

import { Map, List, Apps} from '../../components/Icons'

import Button from '../../components/Button'
import Header from '../../components/Header'
import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import Modal from '../../components/Modal'
import AnimatedLogo from '../../components/Animations/logo/logo'

import Bubble from '../../components/Bubble'
import { ReactComponent as BottomSvg } from './../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from './../../assets/svg/waves.svg'

import { decrypt, encrypt, generateRandomMnuemonic } from '../../lib/utils/crypto'

import { pkce, authenticate } from '../../services/xumm.service'

import accountService from '../../services/account.service'

import xrpl from 'xrpl'
import { Wallet } from 'xrpl'
import jdenticon from "jdenticon"
import Jdenticon from 'react-jdenticon';
import { generate } from 'xrpl-accountlib'

const Home = () => {

    const storeContext = useStoreContext()
    const screenContext = useScreenContext()
    const [isOpen, setIsOpen] = useState<Boolean>(false);

    const handleNavClick = (page:string) => {
        screenContext.setPage(page)
    }

    const handleSend = async () => {
        screenContext.setPage('Send')
    }

    const handleReceive = async () => {
        screenContext.setPage('Receive')
    }

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const overlay = () => {
        if (!isOpen) return null

        return <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <AnimatedLogo size={94}/>
                    <div className={style.loading}>LOADING</div>
                </Modal>
        }

    return (
                <>
                    <div className={style.inner}>

                        <Header theme={storeContext.theme}/>

                        <div className={style.background}>
                            <div className={`${style.absolute} ${style.tl}`}>
                                    <TopSvg width={450}/>
                                </div>
                            <div className={`${style.absolute} ${style.br}`}>
                                <BottomSvg width={450}/>
                            </div>
                        </div>

                        <div className={style.foreground}>
                            <div className={style.profileContainer}>
                                <div className={style.pageTitle}>home</div>

                                <div className={style.profileWrapper}>
                                    <div className={style.icon}>
                                        <Jdenticon 
                                            size={"130px"} 
                                            value={screenContext.user?.username} />
                                    </div>
                                </div>


                                <div className={style.accountName}>{screenContext.user?.username}</div>
                            </div>

                            <div className={style.middleContainer}>
                                <Button 
                                    width={'92%'}
                                    height={34}
                                    color='white'
                                    type='secondary'
                                    theme={storeContext.theme}
                                    onClick={handleSend}
                                    className={style.button}
                                    >
                                        send</Button>
                                <Button 
                                    width={'92%'}
                                    height={34}
                                    color='white'
                                    type='secondary'
                                    theme={storeContext.theme}
                                    onClick={handleReceive}
                                    className={style.button}
                                    >
                                        receive</Button>
                            </div>



                            <div className={style.buttonContainer}>
                                <Button 
                                    type='menu'
                                    theme={storeContext.theme}
                                    width={260}
                                    onClick={() => handleNavClick("Dashboard")}
                                    className={style.button}
                                    >
                                        <Map fill={color} size={16}
                                        style={{position:'absolute', left:'24px'}}/>
                                        porfolio</Button>
                                <Button 
                                    type='menu'
                                    theme={storeContext.theme}
                                    width={260}
                                    onClick={() => handleNavClick("Cards")}
                                    className={style.button}
                                    >
                                        <List fill={color} size={16}
                                        style={{position:'absolute', left:'24px'}}/>
                                        wallets</Button>
                                <Button 
                                    type='menu'
                                    theme={storeContext.theme}
                                    width={260}
                                    onClick={() => handleNavClick("Apps")}
                                    className={style.button}
                                    >
                                        <Apps fill={color} size={16}
                                        style={{position:'absolute', left:'24px'}}/>
                                        apps</Button>
                            </div>
                        </div>

                        <div className={style.nav}>
                            <Bubble/>
                        </div>
                    </div>
                    {overlay()}
                </>
        )
    }

export default Home

