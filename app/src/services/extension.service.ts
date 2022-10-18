async function importModule(moduleName: string):Promise<any>{
    console.log("importing ", moduleName);
    const importedModule = await import(moduleName);
    console.log("\timported ...");
    return importedModule;
}

export const browser_path = process.env['NODE_ENV'] == 'production'
          ? "webextension-polyfill"
          : null

export const importBrowser = async () => {
    let moduleName:string|null = browser_path;
    let browser
    if (moduleName) browser = await importModule(moduleName);
    return browser
}

export const uuid = () => {
    let uuid:string = '', ii:number;

    for (ii = 0; ii < 32; ii += 1) {
        switch (ii) {
            case 8:
            case 20:
                uuid += '-';
                uuid += (Math.random() * 16 | 0).toString(16);
                break;
            case 12:
                uuid += '-';
                uuid += '4';
                break;
            case 16:
                uuid += '-';
                uuid += (Math.random() * 4 | 8).toString(16);
                break;
            default:
                uuid += (Math.random() * 16 | 0).toString(16);
        }
    }
    return uuid;
}

export const getManagerObject = async () => {
    try {
        let browser = await importBrowser()
        let background;
        if (browser) {
            background = browser.extension.getBackgroundPage()
            if (!background.manager) throw Error('Could not acquire the manager') 
            return background.manager
        }
        if (!browser) {
            background = window.localStorage.getItem('background');
            if (!background) throw Error('Could not acquire the background') 
            let manager = JSON.parse(background).manager;
            if (!manager) throw Error('Could not acquire the manager') 
            return manager
        }
    } catch (e:any) {
        return Error(e)
    }
}

export const getCurrentWindowId = async () => {
    try {
        let browser = await importBrowser()
        if (browser) {
            let current = await browser.tabs.getCurrent();
            if (!current.windowId) throw Error('Could not acquire the current window id') 
            return current.windowId
        }
        if (!browser) {
            let currentId = 100;
            if (!currentId) throw Error('Could not acquire the current window id') 
            return currentId
        }
    } catch (e:any) {
        return Error(e)
    }
}

export const getBackgroundJWT = async (xummKey:string) => {
    try {
        let browser = await importBrowser()
        if (browser) {
            let background = browser.extension.getBackgroundPage()
            if (!background.manager) throw Error('Could not acquire the manager') 
            let jwt = background.manager.jwt[xummKey]
            return jwt
        }
        if (!browser) {
            let background = window.localStorage.getItem('background');
            if (!background) throw Error('Could not acquire the background') 
            let manager = JSON.parse(background).manager;
            let jwt = manager.jwt[xummKey];
            if (!jwt) throw Error('Could not acquire jwt'); 
            return jwt
        }
    } catch (e:any) {
        return Error(e)
    }
}

export const setBackgroundJWT = async (xummKey:string, jwt:string) => {
    try {
        let browser = await importBrowser()
        if (browser) {
            let background = browser.extension.getBackgroundPage()
            if (!background.manager) throw Error('Could not acquire the manager') 
            let jwt = background.manager.jwt[xummKey]
            return jwt
        }
        if (!browser) {
            let background = window.localStorage.getItem('background');
            if (!background) throw Error('Could not acquire the background') 
            let parsedBg = JSON.parse(background);
            parsedBg.manager.jwt[xummKey] = jwt;
            window.localStorage.setItem('background', JSON.stringify(parsedBg))
            return parsedBg
        }
    } catch (e:any) {
        return Error(e)
    }
}

export const getCrossmarkJWT = async () => {
    try {
        let browser = await importBrowser()
        if (browser) { 
            let background = browser.extension.getBackgroundPage()
            if (!background.manager) throw Error('Could not acquire the manager') 
            let jwt = background.manager.crossmark['jwt']
            return jwt
        }
        if (!browser) { 
            let background = window.localStorage.getItem('background');
            if (!background) throw Error('Could not acquire the background') 
            let manager = JSON.parse(background).manager;
            let jwt = manager.crossmark['jwt'];
            if (!jwt) throw Error('Could not acquire jwt');
            return jwt
        }
    } catch (e:any) {
        return Error(e)
    }
}


export const isOriginGranted = async (manager:any, origin:string) => {
    try {
        let browser = await importBrowser()
        let permissions = manager.permissions[origin];
        console.log('this is the manager',manager)
        if (!permissions) return false
        return true
    } catch (e:any) {
        return false
    }
}

export const grantOrigin = async (origin:string) => {
    try {
        let browser = await importBrowser()
        let background = window.localStorage.getItem('background');
        if (!background) throw Error('Could not acquire the background') 
        let parsedBg = JSON.parse(background);
        if (parsedBg.manager.permissions == undefined) parsedBg.manager.permissions={}
        parsedBg.manager.permissions[origin] = true;
        window.localStorage.setItem('background', JSON.stringify(parsedBg))
        return true
    } catch (e:any) {
        console.log(e)
        return false
    }
}

export const emitMessage = async (data:any, target:Window|null) => {
    try {
        if (!target) return false
        target.postMessage(data, window.origin)
        return true
    } catch (e:any) {
        console.log(e)
        return false
    }
}

export const createSampleRequest = (sample:any, key:string) => {
    const payload = sample;
    const params = {'xummKey': key};
    const requestId = uuid();
    const windowId = 100;
    const target = 'sample.domain.com';
    const sender = {id: uuid(), target:target, window: Window , origin:target}

    let background = window.localStorage.getItem('background');
    if (!background) background=JSON.stringify({})
    let parsedBg = JSON.parse(background);
    if (parsedBg.manager == undefined) {
        parsedBg.manager={
            crossmark:{
                page:undefined,
                listView:undefined
            },
            jwt:{},
            payloads:{},  
            permissions:{}  
        }}

    parsedBg.manager.payloads[requestId] = {
        payload:payload, 
        params:params,
        sender:sender,
        window:windowId,
        target:target
    }

    window.localStorage.setItem('background', JSON.stringify(parsedBg))
}
