import { CrossmarkProvider } from '../crossmark/crossmarkProvider';
import { XRPLProvider } from '../xrpl/xrplProvider';
import * as MESSAGE from '../constants/messages'

const validateCrossmarkSchema = {
    get(target, prop) {
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        }
        let value = target[prop];
        return (typeof value === 'function') ? value.bind(target) : value; // (*)
      },
    set(target, prop, val) { // to intercept property writing
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        } else {
          target[prop] = val;
          return true;
        }
      },
    deleteProperty(target, prop) { // to intercept property deletion
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        } else {
          delete target[prop];
          return true;
        }
      },
    ownKeys(target) { // to intercept property list
        return Object.keys(target).filter(key => !key.startsWith('_'));
      }
};

const validateXrplSchema = {
    get(target, prop) {
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        }
        let value = target[prop];
        return (typeof value === 'function') ? value.bind(target) : value; // (*)
      },
      set(target, prop, val) { // to intercept property writing
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        } else {
          target[prop] = val;
          return true;
        }
      },
      deleteProperty(target, prop) { // to intercept property deletion
        if (prop.startsWith('_')) {
          throw new Error("Access denied");
        } else {
          delete target[prop];
          return true;
        }
      },
      ownKeys(target) { // to intercept property list
        return Object.keys(target).filter(key => !key.startsWith('_'));
      }
};


export const initializeProviders = () => {
    window.crossmark = new Proxy(new CrossmarkProvider, validateCrossmarkSchema)
    window.xrpl = new Proxy( new XRPLProvider, validateXrplSchema)
}