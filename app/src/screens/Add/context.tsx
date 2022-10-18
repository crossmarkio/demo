
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
  nav: (page:string) => void
  prev: () => void
}

const AddContext = createContext({} as IContextProps)

export const useAddContext = () => useContext(AddContext)

const AddContextProvider = (props:any) => {

  const [ page, setPage ] = useState<string|undefined>('input')
  const [ data, setData ] = useState<any>(undefined)
  const [ history, setHistory ] = useState<any>(undefined)

  const nav = (nextPage:string) => {
      if (!history) setHistory([page])
      if (history) setHistory(previous => [page, ...previous])
      setPage(nextPage)
  }

  const prev = () => {
    setPage(history[0])
    setHistory(history.slice(1))
  }

  return (
    <AddContext.Provider value={{ 
                                    activePage:page, 
                                    setPage:setPage,
                                    data:data, 
                                    setData:setData,
                                    nav:nav,
                                    prev:prev
                                    }}>
        {props.children}
    </AddContext.Provider>
  )
}

export default AddContextProvider