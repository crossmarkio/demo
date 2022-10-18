import express, { Router } from 'express';
import controller from '../controller/accounts.controller';
import authorize from '../middleware/authorize';
import Role from '../helpers/role';

const router:Router = express.Router()

router
    .get('/ping', controller.ping)
    .post('/authenticate', controller.authenticateSchema, controller.authenticate)
    .post('/refresh-token', controller.refreshToken)
    .post('/revoke-token', authorize.authorize(), controller.revokeTokenSchema, controller.revokeToken)
    .post('/register', controller.registerSchema, controller.register)
    .post('/verify-email', controller.verifyEmailSchema, controller.verifyEmail)
    .get('/verify-email', controller.verifyEmailSchema, controller.verifyEmail)
    .get('/usernames/exists/:username', controller.checkUsername)
    .get('/emails/exists/:email', controller.checkEmail)
    .post('/forgot-password', controller.forgotPasswordSchema, controller.forgotPassword)
    .post('/validate-reset-token', controller.validateResetTokenSchema, controller.validateResetToken)
    .post('/reset-password', controller.resetPasswordSchema, controller.resetPassword)
    .get('/', authorize.authorize(Role.Admin), controller.getAll)
    .get('/:id', authorize.authorize(), controller.getById)
    .get('/key/:id', authorize.authorize(), controller.getKeyById)
    .get('/wallets/:id', authorize.authorize(), controller.getWalletsById)
    .post('/', authorize.authorize(Role.Admin), controller.createSchema, controller.create)
    .put('/:id', authorize.authorize(), controller.updateSchema, controller.update)
    .delete('/:id', authorize.authorize(), controller._delete)
    
    module.exports = router;