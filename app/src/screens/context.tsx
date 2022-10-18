
import React, { 
  useState, 
  createContext, 
  useContext, 
  Dispatch, 
  SetStateAction, 
  useEffect,
  ReactElement } from 'react';

  import account from '../services/account.service';
  import useRefresh from '../hooks/useRefresh';
import { useAuthContext } from '../store/auth';

//import account from '../services/account.service'


  interface IUser {
    username: string,
    accessToken: string,
    id: string,
  }

  interface IContextProps {
    activePage: string
    setPage: Dispatch<SetStateAction<string>>
    getData: any
    passData: Dispatch<SetStateAction<any>>
    user: IUser|undefined
    setUser: Dispatch<SetStateAction<IUser|undefined>>
    nav: (page:string) => void
    prev: () => void
  }


const ScreenContext = createContext({} as IContextProps)

export const useScreenContext = () => useContext(ScreenContext)

const ScreenContextProvider = (props:any) => {

  const [ page, setPage ] = useState<string>('Loading')
  const [ data, setData ] = useState<any>(null)
  const [ user, setUser ] = useState<IUser|undefined>(undefined) 
  const [ history, setHistory ] = useState<any>(undefined)

  const [ accessToken, startRefreshTokenTimer ] = useRefresh();

  const nav = (nextPage:string) => {
      if (!history) setHistory([page])
      if (history) setHistory(previous => [page, ...previous])
      setPage(nextPage)
  }

  const prev = () => {
    setPage(history[0])
    setHistory(history.slice(1))
  }

  const { auth } = useAuthContext()

  const handleRefresh = async () => {
    let response = await accessToken()
    if (response instanceof Error) {
      if (!auth) return
      return setPage("Landing")
    }
    setUser({ username:response.username, 
              id:response.id, 
              accessToken:response.jwtToken })
  }

  const handleLogin = async () => {
    let response = await accessToken()
    if (response instanceof Error) return setPage("Landing")
    setUser({ username:response.username, 
              id:response.id, 
              accessToken:response.jwtToken })
    return setPage("Home")
  }

  useEffect(() => {
    handleLogin()
  }, [])

  useEffect(() => {
    if (auth) return
    handleRefresh()
  }, [auth])

  return (
    <ScreenContext.Provider value={{ 
                                    activePage:page, 
                                    setPage:setPage,
                                    getData:data, 
                                    passData:setData,
                                    user:user, 
                                    setUser:setUser,
                                    nav:nav,
                                    prev:prev
                                    }}>
        {props.children}
    </ScreenContext.Provider>
  )
}

export default ScreenContextProvider