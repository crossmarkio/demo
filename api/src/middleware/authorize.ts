
import express, { Express, Request, Response, NextFunction } from 'express'
import db from '../helpers/db';
import jwt, { verify }  from 'jsonwebtoken'
import { expressjwt, ExpressJwtRequest } from "express-jwt";
import env, { env_global} from '../helpers/env'

const XAPP = process.env['XAPP_SECRET'] || '';
const secret =  env.secret || '';

interface UserPayload {
  id: string
  email: string
  role:string
  ownsToken: (token: any) => boolean
}

declare global {
  namespace Express {
    export interface Request {
      xummAuthHeaders: any 
      user:UserPayload
    }
  }
} 

const uuidv4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

const reqApiKeyMatch = (req:Request, res:Response, next:NextFunction) => {
    const reqApiKey = req.header('x-api-key');
  
    if (typeof reqApiKey === 'string' && uuidv4.test(reqApiKey.trim())) {
      const envKey = 'XAPP_' + reqApiKey.trim().replace(/-/g, '_')
      if (Object.keys(process.env).indexOf(envKey) > -1) {
  
        // Attach prepared axios headers on this specific req.
        Object.assign(req, {
          xummAuthHeaders: {
            headers: {
              'X-API-Key': reqApiKey.trim(),
              'X-API-Secret': process.env[envKey]
            }
          }
        })
        return next()
      }
    }
      console.log('Invalid or missing req API key header')
      res.status(403).json({
        msg: 'Preflight error, missing API key header or invalid',
        error: true
    })
  }
  
const authorizeXumm = (req:any, res:Response, next:NextFunction) => {
    try {
        const authorization = req.header('Authorization');
        if (authorization == null) return null;
        const decodedJwt = jwt.verify(authorization, XAPP);
        if (typeof decodedJwt === 'string') return null;
        const reqApiKey = decodedJwt['app'];
  
        if (typeof reqApiKey === 'string' && uuidv4.test(reqApiKey.trim())) {
          const envKey = 'XAPP_' + reqApiKey.trim().replace(/-/g, '_')
    
          if (Object.keys(process.env).indexOf(envKey) > -1) {
              // Attach prepared axios headers on this specific req.
    
              Object.assign(req, {
              xummAuthHeaders: {
                  headers: {
                  'X-API-Key': reqApiKey.trim(),
                  'X-API-Secret': process.env[envKey]
                  }
              }
              })
    
              // `return` to skip the error response, no code after here
              return next();
          }
        }
  
      console.log('Invalid or missing req API key in JWT')
      res.status(403).json({
        msg: 'JWT missing valid API Key',
        //error: e.message
      })    
  } catch(e:any) {
      res.status(403).json({
      msg: 'invalid token',
      error: e.message
      })
    }
  }


const authorize = (roles:any = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
  
    return [
        // authenticate JWT token and attach user to request object (req.user)
        //expressjwt({ secret: secret, algorithms: ['HS256'] }),

        async (req:Request, res:Response, next:NextFunction ) => {
            let token = req.headers['x-access-token'] || req.headers['authorization']; 
            if (!token) next()
            // Remove Bearer from string
            if (token && typeof token == 'string') token = token.replace(/^Bearer\s+/, "");

            if (token && typeof token == 'string') {
              jwt.verify(token, secret, (err: any, decoded: any) => {
                if (err) return res.status(401).json({ message: 'Unauthorized' });
                req.user = decoded;
                next();
              });
            } else {
              return res.status(401).json({ message: 'Unauthorized' });
            }
        },

        // authorize based on user role
        async (req:Request, res:Response, next:NextFunction ) => {
            const account = await db.Account.findById(req.user.id);
            const refreshTokens = await db.RefreshToken.find({ account: account.id });

            if (!account || (roles.length && !roles.includes(account.role))) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            req.user.role = account.role;
            req.user.ownsToken = (token: any) => !!refreshTokens.find((x: { token: any; }) => x.token === token);
            next();
        }
    ];
}


export default {
  authorize,
  reqApiKeyMatch,
  authorizeXumm
}
  