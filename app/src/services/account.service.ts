import axios from 'axios';
import config from '../../../config'

axios.defaults.baseURL = config.api.url


const authenticate = async ({ user, pass }:{ user: string, pass:string }) => {
    try{
        let response = await axios.post(`/accounts/authenticate`, 
        { username: user, password: pass },
        {   withCredentials: true, 
            headers: {  'Content-Type': 'application/json'}})
        return response.data
    } catch(error:any) {
        return Error(error.response.data.message)
    }
}

const update = async ( id:string, params:any, jwt:string) => {
    try{
        let response = await axios.put(`/accounts/${id}`,
             params , 
            { headers: { 
                'Authorization': `Bearer ${jwt}`, 
                'Content-Type': 'application/json', 
            }})
        return response.data
    } catch(error:any) {
        return Error(error.response.data.message)
    }
}

const getWallets = async ( id?:string, jwt?:string) => {
    try{
        let response = await axios.get(`/accounts/wallets/${id}`,
            {   withCredentials: true,  
                headers: { 
                'Authorization': `Bearer ${jwt}`, 
                'Content-Type': 'application/json', 
            }})
        return response.data
    } catch(error:any) {
        return Error(error.response.data.message)
    }
}

const getKey = async ( id?:string, jwt?:string) => {
    try{
        let response = await axios.get(`/accounts/key/${id}`,
            {   withCredentials: true,  
                headers: { 
                'Authorization': `Bearer ${jwt}`, 
                'Content-Type': 'application/json', 
            }})
        return response.data
    } catch(error:any) {
        return Error(error.response.data.message)
    }
}

const verifyEmail = async ({authToken, jwt}:{authToken: string, jwt:string}) => {
    let response = await axios.post(`/accounts/verify-email`, 
            { token: authToken }, 
            {   withCredentials: true,     
                headers: { 
                'Authorization': `Bearer ${jwt}`, 
                'Content-Type': 'application/json', 
            }})

        console.log(response)
        //return user.data.data
}

const register = async (
    {username, email, password, recovery, confirmPassword, acceptTerms}:
    {username:string, email:string, recovery:string, password:string, confirmPassword:string, acceptTerms:boolean}
    ) => {
        try{
            let response = await axios.post(`/accounts/register`, 
                    {   username: username, 
                        email:email, 
                        recovery:recovery,
                        password:password, 
                        confirmPassword:confirmPassword, 
                        acceptTerms:acceptTerms
                    },
                    { 
                        headers: { 
                        'Content-Type': 'application/json', 
                    }});

            console.log(response)
            return undefined
        } catch (e:any) {
            return e
        }
}

const checkEmail = async (
    {email}:{email:string}
    ) => {
    try{
        let response = await axios.get(`/accounts/emails/exists/${email}`);
        return response.data
    } catch(e:any) {
        return Error
    }
}

const checkUsername = async (
    {username}:{username:string}
    ) => {
    try{
        let response = await axios.get(`/accounts/usernames/exists/${username}`);
        return response.data
    } catch(e:any) {
        return Error
    }
}

const revoke = async (accessToken:string) => {
    let response = await axios.post(`/accounts/revoke-token`, {}, 
            {   withCredentials: true,     
                headers: { 
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json', 
            }})

        return response
}

export default {
    authenticate,
    update,
    verifyEmail,
    register,
    getWallets,
    revoke,
    checkUsername,
    checkEmail,
    getKey
}