
import React, { 
  useState, 
  createContext, 
  useContext, 
  useEffect, 
  Dispatch, 
  SetStateAction, 
  ReactElement } from 'react'

import { init } from '../lib/utils/client';

import useLocalStorage from '../hooks/useLocalStorage';
import useStorage from '../hooks/useStorage';

import { Client } from 'xrpl';
import * as constants from '../lib/constants/networks'

interface IContextProps {
  data: string
  client:Client|undefined
  setData: Dispatch<SetStateAction<string>>
  theme:any
  setTheme: Dispatch<SetStateAction<any>>
  connection: boolean
  activeNetwork: any
  setActiveNetwork: Dispatch<SetStateAction<any>>
  networks: any
  setNetworks: Dispatch<SetStateAction<any>>
  keychain: any
  setKeychain: Dispatch<SetStateAction<any>>
  walletChain: any
  setWalletChain: Dispatch<SetStateAction<any>>
  contacts: any
  setContacts: Dispatch<SetStateAction<any>>
  recents: any
  setRecents: Dispatch<SetStateAction<any>>
}

const StoreContext = createContext({} as IContextProps)

export const useStoreContext = () => useContext(StoreContext)

const StoreContextProvider = (props:any) => {
  const [ data, setData ] = useState<string>('')

  const [ contacts, setContacts ] = useStorage('contacts','')
  const [ recents, setRecents ] = useStorage('recents','')

  const [ walletChain, setWalletChain ] = useStorage('walletChain','')
  const [ keychain, setKeychain ] = useStorage('keychain','')

  const [ theme, setTheme ] = useStorage('theme','light')
  const [ activeNetwork, setActiveNetwork  ] = useStorage('activeNetwork', constants.networks[0])
  const [ networks, setNetworks ] = useStorage('networks', constants.networks)

  const [ client, setClient ] = useState<Client|undefined>(undefined)
  const [ connection, setConnection ] = useState<boolean>(false)

  const updateClient = async (node:string) => {
    try{
      console.log(node)
      let api = await init(node)
      await api.connect()
      setClient(api)
      setConnection(true)
    } catch(e) {
      setConnection(false)
    }
  }

  useEffect(() => {
      setConnection(false)
      if (!activeNetwork) return
      updateClient(activeNetwork.wss)
  }, [activeNetwork])

  return (
    <StoreContext.Provider value={{ 
                                    data:data, 
                                    setData:setData,

                                    client:client,
                                    connection:connection,

                                    theme:theme,
                                    setTheme:setTheme,

                                    activeNetwork:activeNetwork, 
                                    setActiveNetwork:setActiveNetwork,

                                    networks:networks, 
                                    setNetworks:setNetworks,

                                    keychain:keychain, 
                                    setKeychain:setKeychain,

                                    walletChain:walletChain, 
                                    setWalletChain:setWalletChain,

                                    contacts:contacts, 
                                    setContacts:setContacts,

                                    recents:recents, 
                                    setRecents:setRecents
                                  }}>
        {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider