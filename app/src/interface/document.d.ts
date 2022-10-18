declare global {
    interface Window {
        request:any
        id:any
        xrpl: {
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