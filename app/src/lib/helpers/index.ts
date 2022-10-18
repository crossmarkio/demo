import accountService from "../../services/account.service"
import { encrypt, decrypt } from "../utils/crypto"

export const addWalletToChain = async (wallet, walletChain) => {
    if (!walletChain || walletChain == 'undefined') return walletChain = [ wallet ];
    let keys = walletChain.map((wallet) => wallet.key);
    if (keys.indexOf(wallet.key) > -1) return Error('wallet aleady exists');
    walletChain.push(wallet);
    console.log(walletChain)
    return walletChain;
}

export const removeWalletFromChain = async (wallet, walletChain) => {
    if (!walletChain || walletChain == 'undefined') return walletChain = [ wallet ];
    let keys = walletChain.map((wallet) => wallet.key);
    let index = keys.indexOf(wallet.key)
    if (index > -1) walletChain.splice(index, 1)
    if (index == -1) return Error('wallet does not exists');
    return walletChain;
}

export const modifyWalletToChain = async (wallet, walletChain) => {
    let keys = walletChain.map((wallet) => wallet.key);
    let index = keys.indexOf(wallet.key)
    walletChain[index] = wallet
    return walletChain;
}

const doesExists = (wallet, keychain) => {
    try{
        let result = keychain[wallet.key]
        if (result) return true
    } catch(e:any) {
        return false
    }
}

export const addKeyToChain = async (id:string|undefined, accessToken:string|undefined, keychain, obj) => {
    if(!id || !accessToken ) return Error('could not aquire key for encryption')
    let key = await accountService.getKey(id, accessToken)
    if (keychain == '' || !keychain) {
        let cypher = encrypt(JSON.stringify(obj.account), key)
        let temp={}
        temp[obj.wallet.key] = cypher
        return JSON.stringify(temp)
    }
    let handled = JSON.parse(keychain)
    console.log(handled)
    if( doesExists(obj.wallet, handled )) return Error('wallet already exists on keychain')
    let cypher = encrypt(JSON.stringify(obj.account), key)
    handled[obj.wallet.key] = cypher
    console.log(handled)
    return JSON.stringify(handled)
}


