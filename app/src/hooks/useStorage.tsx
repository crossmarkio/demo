import { useState, useEffect } from 'react'
import path from 'path';

const importModule = async (moduleName: string):Promise<any> => {
    const importedModule = await import(
            /* webpackChunkName: "webextension-polyfill" */
            /* webpackMode: "lazy" */
            "webextension-polyfill"
        );
    return importedModule;
}

const browser_path = process.env['NODE_ENV'] == 'production'
            ? "webextension-polyfill" 
            : null

const importBrowser = async () => {
    let moduleName:string|null = browser_path;
    let browser:any
    if (moduleName) browser = await importModule(moduleName);
    return browser
}

const getSavedValue = async (key:string, initialValue:any, storage:any,) => {
    let savedValue:any

    if (!storage) return
    if (storage.t=='browser') {
        return new Promise((resolve, reject) => {
            storage.s.get([key]).then((result:any) => { 
                console.log(result)
                console.log(result[key])
              if (result[key] === undefined) {
                if (initialValue instanceof Function) resolve(initialValue())
                resolve(initialValue);
              } else {
                resolve(result[key]);
              }
            });
          });
    }

    if (storage.t=='local') {
        let item = storage.s.getItem(key)
        if (item) savedValue = JSON.parse(item)
        if (savedValue) return savedValue
    
        if (initialValue instanceof Function) return initialValue()
        return initialValue;
    }

    return initialValue
}

const setSaveValue = (key:string, value:any, storage:any) => {
    if (!storage) return
    if (storage.t=='browser') {
        console.log('key:', key)
        console.log('value:', value)
        let data={}
        data[key]=value
        console.log(data)
        storage.s.set(data)
    }

    if (storage.t=='local') {
        storage.s.setItem(key, JSON.stringify(value))
    }
}

const getStorage = async () => {
    let browser = await importBrowser()
    if (browser) return {
        t: 'browser',
        s: browser.storage.local
    }
    if (!browser) return {
        t: 'local',
        s: localStorage
    }
}

const useStorage = (key:string, initialValue:any) => {
        const [ storage, setStorage ] = useState<any>(undefined)
        const [ value, setValue ] = useState<any>(undefined)

        const initStorage = async () => {
            let s = await getStorage()
            setStorage(s)
        }

        const savedValue = async () => {
            console.log(key, initialValue)
            let item = await getSavedValue(key, initialValue, storage)
            console.log('setting value', key, item)
            if( key === 'networks') return setValue(initialValue)
            setValue(item)
        }

        useEffect(() => {
            if (!storage) initStorage()
            if (storage) savedValue()
        }, [storage])

        useEffect(() => {
            console.log(value, key)
                if (!value) return
                console.log('setting value')
                console.log(value)
                setSaveValue(key, value, storage)
        }, [value])

    return [ value, setValue ]
}

export default useStorage;