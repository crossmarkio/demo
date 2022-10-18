import React, { useRef, useState, useEffect }from 'react'
import style from '../index.module.scss'

import { Crossmark } from '../../../components/Icons'

import { ReactComponent as BottomSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../../assets/svg/waves.svg'
import { ReactComponent as KeynameLogo } from '../../../assets/svg/keyname-banner.svg'

import { Cross, Check, ArrowLeft, AngleSmallRight} from '../../../components/Icons'

import Button from '../../../components/Button'

import { useStoreContext } from '../../../store/store'
import { useScreenContext } from '../../context'
import { useAddContext } from '../context'
import { useAuthContext } from '../../../store/auth';

import useRefresh from '../../../hooks/useRefresh'

import account from '../../../services/account.service'

import Input from '../../../components/Input'
import accountService from '../../../services/account.service'

import XummComponent from '../../../components/Xumm'

import { decrypt, encrypt } from '../../../lib/utils/crypto'

import { addWalletToChain, addKeyToChain } from '../../../lib/helpers'

const Warning = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const addContext = useAddContext();

    const [ status, setStatus ] = useState<any>(undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white';

    const handleBack = () => {
        addContext.setPage("input")
    }

    const handleAccept = () => {
        addContext.setPage("seed")
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

                            <div className={style.container}>

                            <div className={style.back} onClick={handleBack}>
                                <ArrowLeft fill={color} size={28}/>
                            </div>

                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>ADD WALLET</div>
                                </div>

                                <div className={style.container}>
                                    <div className={style.warningTitle}>import seed account</div>
                                    <div className={style.warningDescription}>To import a wallet with a seed ( key or phrase), you will need to temporarily expose your key to crossmark. This key will be encryted and stored locally on your computed.  </div>
                                </div>
                                <div className={style.warningContainer}>
                                    <div className={style.warningInfo}>Disclaimer</div>
                                    <div className={style.warningInfo}>Exposing your wallet’s secret key comes with some risks. By proceeding, you are acknowledging the risks of importing a wallet by seed and this could lead to loss of funds.</div>
                                </div>

                                <div className={style.genericButtonContainer}>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleAccept}
                                            className={style.button}
                                            >acknowledge + proceed
                                            
                                        </Button>
                                    </div>      
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default Warning

