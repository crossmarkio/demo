import browser, { browserSettings, Cookies } from 'webextension-polyfill';
import * as MESSAGES from './lib/constants/messages';
import * as utils from './lib/utils'
import { injectToDom } from './lib/utils/injection';

injectToDom('static/js/inject.bundle.js')

const inspectCookies = (cookie: Cookies.Cookie) => {
    console.log(cookie)
}

browser.storage.local.set({
  [window.location.hostname]: document.title,
}).then(() => {
  browser.runtime.sendMessage(`Saved document title for ${window.location.hostname}`);
});


class Operator {
  uuid: string
  connected: boolean
  target: string
  timestamp: number | undefined;
  source: any
  activeRequests:any
  site: Promise<{ name: string; img: string | null; }>
  
  constructor() {
    this.uuid = utils.uuid();

    this.target = window.origin;
    this.site = utils.site.getSiteMeta()


    this._init();
    this.connected = false;
    this.activeRequests = {};

    this.timestamp = Date.now();

    browser.runtime.onMessage.addListener(this._handleInternalMessaging);
  }

  private _init = () => {
    console.log('initalizing in context')

    // Set local id equal to operator id 
    let id = this.uuid

    // Opening channel to receive messages
    this._openChannel()

    // Send initalization message to open comms
    window.addEventListener("message", function(event) {
        // We only accept messages from ourselves
        if (event.source != window || !event.source )
            return;
    
        if (event.data.type && (event.data.type == MESSAGES.TYPE_INIT)) {
            event.source.window.postMessage(
              { id: id, msg: "initialized"}, event.origin )
        }
    });

    // Refresh custom event listener to discourage snooping
    setInterval(() => {
      let oldId = this.uuid;
      let newId = utils.uuid()
      this.uuid = newId;

      this._refreshChannel(oldId)
      let event = new CustomEvent(oldId, { 
          detail: { 
            id: newId, 
            type: MESSAGES.TYPE_REFRESH
          } 
      });

      document.dispatchEvent(event);
      }, 60000)
  }

  private _openChannel = async () => {
        // Listen for initial message from client
        document.addEventListener(this.uuid, this._handleIncomingMsg)
  }

  private _refreshChannel = async (oldId:string) => {
    // Refreshing channel in context
    document.removeEventListener(oldId, this._handleIncomingMsg, false)
    
    // Listen for initial message from client
    document.addEventListener(this.uuid, this._handleIncomingMsg)
}

  private _handleIncomingMsg = (event:any) => {
    // We only accept messages from ourselves
    if ( event.target != window.document
      || event.target.location.origin != window.location.origin) return;

    // Catch message to background and ignore
    if (!event.detail) return

    if (event.timeStamp) this.timestamp = event.timeStamp
    if (event.detail.type != MESSAGES.TYPE_DISCONNECT) this.connected = true;
    if (event.detail.type == MESSAGES.TYPE_PING) this.timestamp = Date.now();
    if (event.detail.type == MESSAGES.TYPE_REQUEST) this._parseRequest(event);
  }

  private _parseRequest = async (event:any) => {
    let data = {
      channel: event.type,
      id: event.detail.id,
      command: event.detail.command,
      payload: undefined
    }
    if (event.detail.payload) data.payload = event.detail.payload
    this._commsWithBg(data)
  }

  private _commsWithBg = async (data:any) => {
    let res = await browser.runtime.sendMessage(data);
    // If there is an immediate response from background, return this response
    if (res) return res
    // Otherwise log the request and wait for response
    this.activeRequests[data.id] = data
  }

  private _handleInternalMessaging = (request: any, sender: any) => {
    let event = new CustomEvent(this.uuid, { detail: request });
    document.dispatchEvent(event);
  }
}

new Operator()