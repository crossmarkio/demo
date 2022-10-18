import React, {Suspense, lazy, useState} from 'react'
import style from '../index.module.scss'

import { networks } from '../../../lib/constants/networks'
import Header from '../../../components/Header'
import TitleBock from '../../../components/TitleBlock'
import { useStoreContext } from '../../../store/store'
import { useSettingsContext } from '../context'


const Nodes = () => {

    const storeContext = useStoreContext()
    const settingsContext = useSettingsContext()

    const [state, setState] = useState('assets') 
    const color = storeContext.theme == 'light' ? 'black' : 'white'

    const handleNode = (node:string) => {
        console.log(node)
        storeContext.setActiveNetwork(JSON.stringify(node))
    }

    let iconColor = storeContext.theme == "light" ? 'rgb(2, 2, 2)' : 'rgb(247, 247, 247)';
    
    return (
                <>
                    <div className={style.route}>

                    <Header theme={storeContext.theme}/>

                    <TitleBock 
                        theme={storeContext.theme}
                        back= {'advanced'}
                        context= {settingsContext}
                        />

                        <div className={style.background}></div>

                        <div className={style.foreground}>

                            <div className={style.title}>{'Nodes'}</div>
                             { JSON.parse(storeContext.networks).map((network, index) => 
                                    <div className={`
                                        ${style.networkSection} 
                                        ${network == storeContext?.activeNetwork ? style.active : null }` }
                                        onClick={() => handleNode(network)}
                                        >{network.name}</div>)
                                }
                        </div>
                    </div>
                </>
        )
    }

export default Nodes

