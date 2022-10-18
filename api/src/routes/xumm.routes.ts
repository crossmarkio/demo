import express, {Router} from 'express'
import controller from '../controller/xumm.controller'
import authorize from '../middleware/authorize'

const router:Router = express.Router()

router
    .get('/ping', authorize.reqApiKeyMatch, controller.ping)
    .get('/init/:uuid', authorize.reqApiKeyMatch, controller.getUserToken)
    .get('/meta/:uuid', authorize.reqApiKeyMatch, controller.getPayloadMetadata)
    .get('/qr', authorize.reqApiKeyMatch, controller.getQrCode)
    .get('/hash/:uuid', authorize.reqApiKeyMatch, controller.getTxHash)
    .get('/init', authorize.reqApiKeyMatch, controller.init)
    .post('/payload', authorize.reqApiKeyMatch, controller.payload)

module.exports = router;

