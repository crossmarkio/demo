
import express, { Express, Request, Response, NextFunction } from 'express'

import Joi from 'joi';
import validateRequest from '../middleware/validate';
import authorize from '../middleware/authorize';
import Role from '../helpers/role';
import accountService from '../services/account.service';
import env from '../helpers/env'
import db from '../helpers/db';

const authenticateSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    accountService.authenticate({ username, password, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    accountService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

const revokeTokenSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

const revokeToken = (req: any, res: Response, next: NextFunction) => {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: 'Token is required' });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.revokeToken({ token, ipAddress })
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}

const registerSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        recovery: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        acceptTerms: Joi.boolean().valid(true).required()
    });
    validateRequest(req, next, schema);
}

const register = (req: Request, res: Response, next: NextFunction) => {
    accountService.register(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Registration successful, please check your email for verification instructions' }))
        .catch(next);
}

const verifyEmailSchema = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.token && req.query['token']) req.body.token = req.query['token'];
    if (!req.body.token) next(`Validation error: Token not found`);
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

const verifyEmail = (req: Request, res: Response, next: NextFunction) => {
    accountService.verifyEmail(req.body)
        .then(() => res.redirect('http://localhost:3000/verification_complete.html'))
        //.then(() => res.json({ message: 'Verification successful, you can now login' }))
        .catch(next);
}

const checkEmail = (req: Request, res: Response, next: NextFunction) => {
    accountService.checkEmail({email:req.params['email']})
        .then((response) => {
            res.json({ exists: response ? true : false })
        })
        .catch(next);
}

const checkUsername = (req: Request, res: Response, next: NextFunction) => {
    accountService.checkUsername({username:req.params['username']})
        .then((response) => {
            res.json({ exists: response ? true : false })
        })
        .catch(next);
}

const forgotPasswordSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

const forgotPassword = (req: Request, res: Response, next: NextFunction) => {
    accountService.forgotPassword(req.body, req.get('origin'))
        .then(() => res.json({ message: 'Please check your email for password reset instructions' }))
        .catch(next);
}

const validateResetTokenSchema =(req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

const validateResetToken = (req: Request, res: Response, next: NextFunction) => {
    accountService.validateResetToken(req.body)
        .then(() => res.json({ message: 'Token is valid' }))
        .catch(next);
}

const resetPasswordSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}

const resetPassword = (req: Request, res: Response, next: NextFunction) => {
    accountService.resetPassword(req.body)
        .then(() => res.json({ message: 'Password reset successful, you can now login' }))
        .catch(next);
}

const getAll = (req: Request, res: Response, next: NextFunction) => {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

const getById = (req: any, res: Response, next: NextFunction) => {
    // users can get their own account and admins can get any account
    if (req.params['id'] !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.getById(req.params['id'])
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

const getWalletsById = (req: any, res: Response, next: NextFunction) => {
    // users can get their own account and admins can get any account
    if (req.params['id'] !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.getWalletsById(req.params['id'])
        .then(account => account ? res.json(account.wallets) : res.sendStatus(404))
        .catch(next);
}

const getKeyById = (req: any, res: Response, next: NextFunction) => {
    // users can get their own account and admins can get any account
    if (req.params['id'] !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.getKeyById(req.params['id'])
        .then(key => key ? res.json(key) : res.sendStatus(404))
        .catch(next);
}

const createSchema = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}
 
const create = (req: Request, res: Response, next: NextFunction) => {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

const updateSchema =(req: any, res: Response, next: NextFunction) => {
    
    let wallet = Joi.object().keys({
        key: Joi.string().required(),
        name: Joi.string().empty(''),
        description: Joi.string().empty(''),
        preferredToken: {
            currency: Joi.string().empty(''),
            issuer: Joi.string().empty('')
        },
        method: Joi.string().empty(''),
        keyname: Joi.boolean().empty(''),
        acceptTerms: Joi.boolean().valid(true),
        remove: Joi.boolean()
      })
    
    const schemaRules = {
        username: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        recovery: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        wallets: Joi.array().items(wallet),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        security: Joi.object().keys({
            reqLoginPin: Joi.boolean(),
            reqLoginPass: Joi.boolean(),
            autoLogout: Joi.boolean()
        })
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

const update = (req: any, res: Response, next: NextFunction) => {
    // users can update their own account and admins can update any account

    if (req.params['id'] !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.update(req.params['id'], req.body)
        .then(account => res.json(account))
        .catch(next);
}

const _delete = (req: any, res: Response, next: NextFunction) => {
    // users can delete their own account and admins can delete any account
    if (req.params['id'] !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.delete(req.params['id'])
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}

// helper functions

function setTokenCookie(res: Response, token:string) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}

const ping = async (req:Request, res:Response, next:NextFunction) => {
    res.json('pong')
  }

  export default {
    ping,
    authenticateSchema,
    authenticate,
    refreshToken,
    revokeTokenSchema,
    revokeToken,
    registerSchema,
    register,
    verifyEmailSchema,
    verifyEmail,
    forgotPasswordSchema,
    forgotPassword,
    validateResetTokenSchema,
    validateResetToken,
    resetPasswordSchema,
    resetPassword,
    getAll,
    getById,
    getWalletsById,
    createSchema,
    create,
    updateSchema,
    update,
    _delete,
    checkEmail,
    checkUsername,
    getKeyById
}
