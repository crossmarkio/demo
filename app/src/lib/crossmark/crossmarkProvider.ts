import EventEmitter from 'events';
import * as utils from '../utils'
import * as MESSAGES from '../constants/messages';

declare global {
  interface Window {
      crossmark: {
          sign: (payload: any) => Promise<unknown> | undefined | void;
          isConnected: () => Promise<unknown>;
          open: () => Promise<unknown>;
          on(event: 'accountsChanged', listener: (name: string) => void);
          on(event: 'chainChanged', listener: (name: string) => void);
          on(event: 'connect', listener: (name: string) => void);
          on(event: 'disconnect', listener: (name: string) => void);
          on(event: 'message', listener: (name: string) => void);
      }
    }
}

class CrossmarkProvider extends EventEmitter{
  target: any
  origin: string
  channelId: string 
  active:any

  constructor() {
    super();
    this.channelId = '';
    this.origin = '';
    this.active = {};
    this._init();
  }

  // ---------------
  // Private methods
  // ---------------
  protected _init = async () => {
    console.log('initalizing in client')
    // Send message to extenstion context to establish channel
    window.postMessage({
      type: "init", 
      msg: "Requesting startup id"}, window.location.origin)

    // Listen for initial message from client
    window.addEventListener("message", this._handleMsg)
  }

  protected _handleMsg = (event:any) => {
      // We only accept messages from ourselves
      if (event.source != window 
        || !event.source 
        || event.origin != window.location.origin) return;

      // Store data in memory if exists
      this.target = event.source || null
      this.origin = event.origin || null
      if (event.data.id) this._ping(event, false)
  }

  protected _handleCustomMsg = (event:any) => {
      // We only accept messages from ourselves
      if ( event.target != window.document
        || event.target.location.origin != window.location.origin) return;
        
      if ( event.detail.type == "ping" ) return
      if ( event.detail.type == "request" ) return
      if ( event.detail.type == "refresh" ) return this._ping(event, true)

      if (event.detail.type == "response" && this.active[event.detail.id]) {
        return this.active[event.detail.id].resolve(event.detail)
      }
      if ( event.detail.type == "response" ) return console.log('this is client side response', event.detail)
      return console.log("uncaght custom handle message", event)
  }

  protected _ping = (e:any, refresh:boolean) => {

    if (refresh) document.removeEventListener(e.type, this._handleCustomMsg, false)

    let id = e.data?.id || e.detail?.id
    this.channelId=id
    document.addEventListener(id, this._handleCustomMsg)

    let event = new CustomEvent(id, { detail: { type: "ping" } });
    document.dispatchEvent(event);
  }

  // ---------------
  // Public methods
  // ---------------

  public sign = async (payload:any) => {
      if (!payload) return

      let req_id = utils.uuid()
      let rx = { 
            type: MESSAGES.TYPE_REQUEST, 
            command: MESSAGES.COMMAND_SIGN, 
            id: req_id,
            payload: payload 
        } 

      let res:any = await this._fire(this.channelId, rx)
      return res.response
  }

  public isConnected = async () => {
    let req_id = utils.uuid();
    let rx = {
      type: MESSAGES.TYPE_REQUEST, 
      command: MESSAGES.COMMAND_IS_CONNECTED, 
      id: req_id 
    }
    let res:any = await this._fire(this.channelId, rx)
    return res.response
  } 

  public isLocked = async () => {
    let req_id = utils.uuid();
    let rx = {
      type: MESSAGES.TYPE_REQUEST, 
      command: MESSAGES.COMMAND_IS_LOCKED, 
      id: req_id 
    }
    let res:any = await this._fire(this.channelId, rx)
    return res.response
  } 

  public open = async () => {
    let req_id = utils.uuid();
    let rx = {
      type: MESSAGES.TYPE_REQUEST, 
      command: MESSAGES.COMMAND_OPEN, 
      id: req_id 
    }
    let res:any = await this._fire(this.channelId, rx)
    return res.response
  } 

  public version = async () => {
    let req_id = utils.uuid();

    let rx = {
      type: MESSAGES.TYPE_REQUEST, 
      command: MESSAGES.COMMAND_VERSION, 
      id: req_id 
    }

    let res:any = await this._fire(this.channelId, rx)
    this.emit("version", res)
    return res.response
  } 

  protected _fire = async (id:string, data:any) => {
      let event = new CustomEvent(id, 
          { detail: data 
      });

      // Emit signal to context operator for processing
      document.dispatchEvent(event);

      // Await response from operator, holding function response
      let response = await new Promise((resolve, reject) => {
        this.active[data.id]={'resolve':resolve, 'reject':reject}
      })

      // Remove resolved object from active requests
      delete this.active[data.id]

      return response
  };
} 

export { CrossmarkProvider }


