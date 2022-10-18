
import express, { Express, Request, Response, NextFunction } from 'express'

import Joi from 'joi';
import validateRequest from '../middleware/validate';
import oracleService from '../services/oracle.service';
import Role from '../helpers/role';


const timeSeriesSchema =(req: any, res: Response, next: NextFunction) => {

    const schemaRules = Joi.object({
        tickers: Joi.array(),
        interval: Joi.number(),
        unit: Joi.string(),
        page: Joi.number(),
        range: Joi.array(),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
    });

    validateRequest(req, next, schemaRules);
}

const getTimeSeries = async (req: Request, res: Response, next: NextFunction) => {
        oracleService.getPriceAtInterval(req.body)
        .then(response => res.json(response))
        .catch(next);
}

const ping = async (req:Request, res:Response, next:NextFunction) => {
    res.json('pong')
  }

export default {
    ping,
    getTimeSeries,
    timeSeriesSchema
}
