import browser from 'webextension-polyfill';

export const injectToDom = (path:string) => {
    var s = document.createElement('script');
    s.src = browser.runtime.getURL(path);
    document.documentElement.appendChild(s);
}