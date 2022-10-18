
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
  data: any
  setData: Dispatch<SetStateAction<any>>
}

const NewContext = createContext({} as IContextProps)

export const useNewContext = () => useContext(NewContext)

const NewContextProvider = (props:any) => {

  const [ page, setPage ] = useState<string|undefined>('input')
  const [ data, setData ] = useState<any>(undefined)

  return (
    <NewContext.Provider value={{ 
                                    activePage:page, 
                                    setPage:setPage,
                                    data:data, 
                                    setData:setData,
                                    }}>
        {props.children}
    </NewContext.Provider>
  )
}

export default NewContextProvider