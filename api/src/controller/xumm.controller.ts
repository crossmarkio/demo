import xumm from '../helpers/xumm'
import express, { Express, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import env, { env_global } from '../helpers/env'
import axios from 'axios'

const getUserToken = async (req:Request, res:Response, next:NextFunction) => {
  try {
      const uuid = req.params['uuid']
      const about = await xumm.getAddress(uuid)
      const user_token = await xumm.getUserToken(uuid)
      res.send({
        data:{ key:about.key, server:about.node, user: user_token },
        msg: 'Successfully acquired uuid metadata'});
  } catch(e:any) {   
      console.log(`API error @ init: ${e.message}`)
      res.status(400).json({
      msg: e.message,
      error: true
      })
  }
}

const getPayloadMetadata = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const uuid = req.params['uuid']
        const about = await xumm.getPayload(uuid)
        res.send({
          data: about,
          msg: 'Successfully acquired uuid metadata'});
    } catch(e:any) {   
        console.log(`API error @ init: ${e.message}`)
        res.status(400).json({
        msg: e.message,
        error: true
        })
    } 
}

const getQrCode = async (req:Request, res:Response, next:NextFunction) => {
    switch (req.body.type.method) {
      case 'xumm':
          xumm.signIn().then((data) => {
              res.send(data);
          });
      break;
    }
}

const getTxHash = async (req:Request, res:Response, next:NextFunction) => {
    const result:any = await xumm.getPayload(req.params['uuid']);
    const hash = result.response.txid
    res.send({data: hash});
}

const init = async (req:any, res:Response, next:NextFunction) => {
  let secret = env.secret
  if (!secret) return
  let authToken
  if (secret) authToken = jwt.sign({
    app: req.xummAuthHeaders.headers['X-API-Key']
  }, secret, { expiresIn: '4h' })

  res.json(authToken)
}

const payload = async (req:any, res:Response, next:NextFunction) => {
  try {
    let baseUrl = 'https://xumm.app';
    let url = new URL(`/api/v1/platform/payload`, baseUrl)
    const response = await axios.post(url.href, req.body, req.xummAuthHeaders)
    res.json(response.data)
  } catch(e:any) {
    console.log(`XUMM API error @ payload post: ${e.message}`)
    res.status(400).json({
        msg: e.message,
        error: true
    })
  }
}

const ping = async (req:Request, res:Response, next:NextFunction) => {
  return res.json('pong')
}
 
export default {
    ping,
    getUserToken,
    getPayloadMetadata,
    getQrCode,
    getTxHash,
    payload,
    init
}