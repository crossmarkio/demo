import express, { Router } from 'express'
import controller from '../controller/xapp.controller'

const router:Router = express.Router()

router
    .get('/ping', controller.ping)
    .get('/xapp/ott/:token', controller.getOttToken)
    .get('/curated-assets', controller.getCuratedAssets)
    .post('/payload', controller.getPayload)
    .get('/payload/:payload_uuid', controller.getPayloadMetadata)
    .post('/event', controller.event)
    .post('/push', controller.push)

module.exports = router;

