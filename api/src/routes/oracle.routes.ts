import express, { Router } from 'express';
import controller from '../controller/oracle.controller';
import authorize from '../middleware/authorize';

const router:Router = express.Router()

router
    .get('/ping', controller.ping)
    .post('/time-series', authorize.authorize(), controller.timeSeriesSchema, controller.getTimeSeries)
    
module.exports = router;