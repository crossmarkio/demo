import React , {useState} from 'react';
import axios from 'axios';

import { useAuthContext } from '../store/auth';

const useRefresh = () => {

    const [ refresh, setRefresh ] = useState<boolean>(true)
    const { setAuth, setUser} = useAuthContext()

    const refreshToken = async () => {
        try{
            let response = await axios.post('/accounts/refresh-token', {}, 
            {   withCredentials: true, 
                headers: {  'Content-Type': 'application/json'}})
            setRefresh(!refresh)
            startRefreshTokenTimer(response.data.jwtToken);
            setUser(response.data)
            setAuth(true)
            return response.data
        } catch(error:any) {
            return Error(error.message)
        }
    }

    let refreshTokenTimeout:NodeJS.Timeout
    const startRefreshTokenTimer = (jwt:string) => {
        // parse json object from base64 encoded jwt token
        let jwtToken = JSON.parse(window.atob(jwt.split('.')[1]));
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        refreshTokenTimeout = setTimeout(() => {setAuth(false)}, timeout);
    }

    const stopRefreshTokenTimer = () => {
        clearTimeout(refreshTokenTimeout);
    }  
    

    return [ refreshToken, startRefreshTokenTimer ] as const
}

export default useRefresh
