
import React, { 
  useState, 
  createContext, 
  useContext, 
  Dispatch, 
  SetStateAction, 
  ReactElement } from 'react'


interface IContextProps {
  activePage: string|undefined
  setPage: Dispatch<SetStateAction<string|undefined>>
}

const SettingsContext = createContext({} as IContextProps)

export const useSettingsContext = () => useContext(SettingsContext)

const SettingsContextProvider = (props:any) => {

  const [ page, setPage ] = useState<string|undefined>('advanced')

  return (
    <SettingsContext.Provider value={{ 
                                    activePage:page, 
                                    setPage:setPage,
                                    }}>
        {props.children}
    </SettingsContext.Provider>
  )
}

export default SettingsContextProvider