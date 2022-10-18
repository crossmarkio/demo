import browser from "webextension-polyfill";
import * as MESSAGES from './lib/constants/messages';

declare global {
  interface Window {
    manager:any
  }
}

class CrossmarkManager {
  timestamp: number | undefined;
  source: any
  open: boolean
  width:number
  height:number
  payloads: any
  channel:string|undefined
  
  constructor() {
    this.open = false
    this.width = 400
    this.height = 630
    this.payloads = {}
    this.channel = undefined

    browser.runtime.onMessage.addListener(this._handleIncomingMessage)
    browser.browserAction.onClicked.addListener(() => !this.open);
  }

    private _handleIncomingMessage = async(request: any, sender: any) => {
      
      if (request.command == MESSAGES.COMMAND_VERSION) {
        let manifest = browser.runtime.getManifest();
        let data = {
          type: MESSAGES.TYPE_RESPONSE,
          response: manifest.version, 
          id: request.id
        };
        browser.tabs.sendMessage(sender.tab.id, data);  
        return Promise.resolve(data);
      }
    
      if (request.command == MESSAGES.COMMAND_IS_CONNECTED) {
        let data = {
          type: MESSAGES.TYPE_RESPONSE,
          response: true, 
          id: request.id
        };
        browser.tabs.sendMessage(sender.tab.id, data);  
        return Promise.resolve(data);
    }

    if (request.command == MESSAGES.COMMAND_OPEN) {
        this._openWindow('popup.html', 'popup', request.id);
          let data = {
            type: MESSAGES.TYPE_RESPONSE,
            response: true, 
            id: request.id
          };
          return Promise.resolve(data);
      } 

      if (request.command == MESSAGES.COMMAND_SIGN) {
          this.payloads[request.id] = request
          this.payloads[request.id].sender = sender
          this._openWindow('index.html', 'popup', request.id);
          browser.tabs.sendMessage(sender.tab.id, {notify: "opened request dialogue"});  
      }
    }

    protected _getScreenSize = () => {
      return [window.screen.width, window.screen.height] as const
    }

    protected _getAllTabs = async () => {
      let query:any = await browser.tabs.query({});
      return query
    }
 
    protected _logActiveViews = () => {
      let activePopups = browser.extension.getViews();
      console.log(activePopups);
      //console.log(id);
      //let window = activePopups.find((window) => window.id == id);
    }

    protected _openWindow = async (source:string, type: any, id:string) => {
      if (!source) source = "index.html"
      if (!type) type = 'popup'

      let screen = this._getScreenSize()
      if (!screen) console.log('Error: Could not determine window size for popup positioning')

      let popup_window = await browser.windows.create({
        'url': source, 
        'type': type, 
        'height': this.height,
        'width': this.width, 
        'top': 0, 
        'left': screen[0]-this.width
      })

      this.payloads[id]['window'] = popup_window.id
      if (popup_window.id) this._logActiveViews()
    }
  }

window.manager = new CrossmarkManager()