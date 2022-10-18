import React, {Suspense, lazy, useState, useRef, useEffect} from 'react'
import style from './index.module.scss'

import { Placeholder, Add,Plus, Cross, Check, ArrowLeft, AngleSmallRight, Crossmark} from '../../components/Icons'

import Button from '../../components/Button'

import { useStoreContext } from '../../store/store'
import { useScreenContext } from '../context'

import Bubble from '../../components/Bubble'

import AssetListFactory from '../../containers/AssetListFactory'
import TokenListFactory from '../../containers/TokenListFactory'

import { ReactComponent as BottomSvg } from '../../assets/svg/waves.svg'
import { ReactComponent as TopSvg } from '../../assets/svg/waves.svg'
import { ReactComponent as KeynameLogo } from '../../assets/svg/keyname-banner.svg'
import { ReactComponent as CrossmarkBanner } from '../../assets/svg/crossmark-banner.svg'
import { ReactComponent as XummBanner } from '../../assets/svg/xumm-banner.svg'
import { ReactComponent as SeedBanner } from '../../assets/svg/seed-banner.svg'

import { modifyWalletToChain } from '../../lib/helpers'

import Input from '../../components/Input'

const WalletFactory = lazy(() => import('../../containers/WalletFactory'));
const CardComponent = lazy(() => import('../../components/Card'));


const colors = [
    'purp',
    'sky',
    'blood',
    'mint',
    'peach',
    'smoke',
    'xumm',
    'gold'
]

const WalletInteface = () => {
    const storeContext = useStoreContext()
    const screenContext = useScreenContext()

    const [ state, setState ] = useState('assets') 

    const [ name, setName ] = useState<string|undefined>(screenContext.getData.wallet.name ? screenContext.getData.wallet.name : undefined) 
    const [ cardColor, setCardColor ] = useState<string|undefined>(screenContext.getData.color ? screenContext.getData.color : undefined)
    const [ inputWallet, setInputWallet ] = useState<any>(screenContext.getData.wallet ? screenContext.getData.wallet : undefined)

    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const cardNameRef = useRef<HTMLInputElement>(null)

    const handleChange = (e:React.FocusEvent<HTMLInputElement>) => {
        let data = inputWallet
        data.name = cardNameRef.current?.value
        setName(data.name)
        setInputWallet(data)
    }

    useEffect(() => {
        console.log('wallet changed')
    }, [inputWallet, name])

    const handleColorChange = (color) => {
        console.log('change')
        let temp = inputWallet;
        temp.color=color
        setInputWallet(temp) 
        setCardColor(color)
    }

    const handleClose = () => {
        screenContext.prev()
    }

    const handleSet = async () => {
        let walletChain = storeContext.walletChain
        let newWalletChain = await modifyWalletToChain(inputWallet, walletChain)
        storeContext.setWalletChain([...newWalletChain])
        console.log('wallet changed')
    }

    const cardFactory = () => {
        return(
            <Suspense fallback={<div>Loading...</div>}>
                <CardComponent 
                    key={0}
                    id={0}
                    width={196}
                    height={105}
                    wallet={screenContext.getData.wallet} 
                    theme={storeContext.theme}
                    />
            </Suspense>
        )
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
                        <div className={style.pageTitle}>WALLET INTERFACE</div>
                    </div>


                    <div className={style.containerTitle}>PREVIEW</div>

                    {cardFactory()}


                    <Input
                        ref={cardNameRef}
                        className={style.input}
                        type='text'
                        placeholder='enter card name'
                        label='card name'
                        value={screenContext.getData.wallet.name}
                        onChange={handleChange}>
                    </Input>

                    <div className={style.colorContainer}>
                        <div className={style.inputTitle}>card color</div>
                        {
                            colors.map((color) => <div 
                                className={`${style.color} 
                                ${style[color]} ${cardColor == color ? style.active : null}`}
                                onClick={() => handleColorChange(color)}
                                ></div>
                            )
                        }
                    </div>

                <div className={style.genericButtonContainer}>
                        <Button
                            type='primary'
                            theme={storeContext.theme}
                            height={40}
                            onClick={handleSet}
                            className={style.button}
                            >set
                        </Button>

                        <Button
                            type='secondary'
                            theme={storeContext.theme}
                            onClick={handleClose}
                            className={style.button}
                            height={40}
                            margin={0}
                            >close
                        </Button>
                    </div>      
            </div>

            </div>
        </div>
    </>
        )
    }

export default WalletInteface


