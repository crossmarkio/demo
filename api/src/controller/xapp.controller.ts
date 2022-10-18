import axios from 'axios';
import express, { Express, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
import path from 'path';
dotenv.config({path: path.join(__dirname, '..','..','.env')})

const uuidv4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

const getOttToken = async (req:Request, res:Response, next:NextFunction) => {
  const token = req.params['token']
      
  if (typeof token !== 'string') {
    console.log('No token given respond 400')
    return res.status(400).json({
      msg: 'Token undefined / invalid',
      error: true
    })
  }

  if (!uuidv4.test(token)) {
  console.log('No token given respond 401')
    return res.status(401).json({
      msg: 'Invalid token format',
      error: true
    })
  }
  
  try {
    const response = await axios.get(`/xapp/ott/${token}`, req.xummAuthHeaders)
    const authToken = jwt.sign({
      ott: token,
      app: req.xummAuthHeaders.headers['X-API-Key']
    }, process.env.XAPP_SECRET, { expiresIn: '4h' })

    response.data['token'] = authToken;
    res.json(response.data)

  } catch(e) {
      console.log(`XUMM API error @ ott fetch: ${e.message}`)
    res.status(400).json({
      msg: e.message,
      error: true
    })
  }
}

const getCuratedAssets = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const response = await axios.get('/curated-assets', req.xummAuthHeaders)
    res.json(response.data)
  } catch(e) {
    console.log(`XUMM API error @ curated assets: ${e.message}`)
    res.status(400).json({
      msg: e.message,
      error: true
    })
  }
}

const getPayload = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const response = await axios.post('/payload', req.body, req.xummAuthHeaders)
    res.json(response.data)
  } catch(e) {
    console.log(`XUMM API error @ payload post: ${e.message}`)
    res.status(400).json({
      msg: e.message,
      error: true
    })
  }
}

const getPayloadMetadata = async (req:Request, res:Response, next:NextFunction) => {
    const uuid = req.params['payload_uuid']
    
    if (typeof uuid === undefined) {
      console.log('No token given respond 400')
      return res.status(400).json({
        msg: 'Token undefined',
        error: true
      })
    }
    
    try {
      const response = await axios.get(`/payload/${uuid}`, req.xummAuthHeaders)
      res.json(response.data)
    } catch(e) {
      console.log(`XUMM API error @ payload get: ${e.message}`)
      res.status(400).json({
        msg: e.message,
        error: true
      })
    }
  }

  const event = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.params['token']
    try {
      const response = await axios.post('/event', req.body, req.xummAuthHeaders)
      res.json(response.data)
    } catch(e) {
      console.log(`XUMM API error @ curated assets: ${e.message}`)
      res.status(400).json({
        msg: e.message,
        error: true
      })
    }
  }

  const push = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.params['token']

    try {
      const response = await axios.post('/push', req.body, req.xummAuthHeaders)
      res.json(response.data)
    } catch(e) {
      console.log(`XUMM API error @ curated assets: ${e.message}`)
      res.status(400).json({
        msg: e.message,
        error: true
      })
    }

  }

  const ping = async (req:Request, res:Response, next:NextFunction) => {
    res.json('pong')
  }
    
export default {
    ping,
    getOttToken,
    getCuratedAssets,
    getPayload,
    getPayloadMetadata,
    event,
    push
}
