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

const Keyname = () => {
    const storeContext = useStoreContext();
    const screenContext = useScreenContext();
    const authContext = useAuthContext();
    const addContext = useAddContext();

    const [ status, setStatus ] = useState<any>(undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white';

    const handleAccept = async () => {
        let keychain = storeContext.keychain
        let walletChain = storeContext.walletChain
        let obj = addContext.data
        obj.wallet.keyname = true;

        // Add to wallet object to database if opted in
        let response:any = await accountService.update( authContext.user?.id, {wallets: [obj.wallet]}, authContext.user?.jwtToken)
        if ( response instanceof Error) console.log(response.message)

        let newWalletChain = await addWalletToChain(obj.wallet, walletChain)
        if (!(newWalletChain instanceof Error)) storeContext.setWalletChain([...newWalletChain])

        // Add to keychain if a seed or new wallet
        let newKeychain
        if (obj.wallet.method == "xumm") return addContext.setPage("added")
        if (obj.wallet.method != "xumm") {
            newKeychain = await addKeyToChain(
                                        screenContext.user?.id, 
                                        screenContext.user?.accessToken,
                                        keychain, obj
            )}

        if (!(newKeychain instanceof Error)) storeContext.setKeychain(newKeychain)
        return addContext.setPage("added")
    }

    const handleDecline = async () => {
        let keychain = storeContext.keychain;
        let walletChain = storeContext.walletChain;
        let obj = addContext.data;
        obj.wallet.keyname=false;

        let newWalletChain = await addWalletToChain(obj.wallet, walletChain)
        if (!(newWalletChain instanceof Error)) storeContext.setWalletChain([...newWalletChain])

        let newKeychain
        if (obj.wallet.method == "xumm") return addContext.setPage("added")
        if (obj.wallet.method != "xumm") {
            newKeychain = await addKeyToChain(
                                        screenContext.user?.id, 
                                        screenContext.user?.accessToken,
                                        keychain, obj
            )}

        if (!(newKeychain instanceof Error)) storeContext.setKeychain(newKeychain)
        return addContext.setPage("added")
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

                                <div className={style.logo}>
                                    <Crossmark stroke={color} size={36}/>
                                    <div className={style.pageTitle}>ADD WALLET</div>
                                </div>

                                <div className={style.container}>
                                    <div className={style.containerTitle}>opt in</div>
                                    <div className={style.keynamelogo}>
                                        <KeynameLogo height={'80%'} fill={color}/>
                                    </div>
                                    <div className={style.description}>Would you like to register this wallet with +keyname?</div>
                                    <div className={style.description}>Explain more?</div>
                                </div>

                                <div className={style.genericButtonContainer}>
                                    <div className={style.info}>dont worry. this can be changed at any time</div>
                                        <Button
                                            type='primary'
                                            theme={storeContext.theme}
                                            height={40}
                                            onClick={handleAccept}
                                            className={style.button}
                                            >accept
                                            
                                        </Button>

                                        <Button
                                            type='secondary'
                                            theme={storeContext.theme}
                                            onClick={handleDecline}
                                            className={style.button}
                                            height={40}
                                            margin={0}
                                            >decline
                                        </Button>
                                    </div>      
                            </div>

                        </div>
                    </div>
                </>
        )
    }

export default Keyname

