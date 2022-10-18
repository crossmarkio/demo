
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

const NotificationContext = createContext({} as IContextProps)

export const useNotificationContext = () => useContext(NotificationContext)

const NotificationContextProvider = (props:any) => {

  const [ page, setPage ] = useState<string|undefined>('grant')
  const [ data, setData ] = useState<any>(undefined)

  return (
    <NotificationContext.Provider value={{ 
                                    activePage:page, 
                                    setPage:setPage,
                                    data:data, 
                                    setData:setData,
                                    }}>
        {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider