
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import sendEmail from '../helpers/send-email';
import db from '../helpers/db';
import Role from '../helpers/role';
import env from '../helpers/env';
import fs from 'fs';

const authenticate = async ({ 
    username, password, ipAddress }: 
    { username:string, password:string, ipAddress:string }) => {
    const account = await db.Account.findOne({ username });

    if (!account || !account.isVerified || !bcrypt.compareSync(password, account.passwordHash)) {
        throw 'Email or password is incorrect';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(account);
    const refreshToken = generateRefreshToken(account, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function refreshToken({ token, ipAddress }:{token:string, ipAddress:string}) {
    const refreshToken = await getRefreshToken(token);
    const { account } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function revokeToken({ token, ipAddress }:{token:string, ipAddress:string}) {
    const refreshToken = await getRefreshToken(token);

    // revoke token and save
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
}

async function register(params:any, origin:any) {

    // validate
    if (await db.Account.findOne({ email: params.email })) {
        // send already registered error in email to prevent account enumeration
        return await sendAlreadyRegisteredEmail(params.email, origin);
    }

    // create account object
    const account = new db.Account(params);

    // first registered account is an admin
    const isFirstAccount = (await db.Account.countDocuments({})) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    // send email
    await sendVerificationEmail(account, origin);
}

async function verifyEmail({ token }:{token:string}) {
    const account = await db.Account.findOne({ verificationToken: token });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function checkUsername({ username }:{username:string}) {
    const account = await db.Account.findOne({ username: username });
    return account 
}

async function checkEmail({ email }:{email:string}) {
    const account = await db.Account.findOne({ email: email });
    return account
}

async function forgotPassword({ email }:{ email:string }, origin:any) {
    const account = await db.Account.findOne({ email });
    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24*60*60*1000)
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }:{token:string}) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';
}

async function resetPassword({ token, password }:{token:string, password:string}) {
    const account = await db.Account.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.passwordReset = Date.now();
    account.resetToken = undefined;
    await account.save();
}

async function getAll() {
    const accounts = await db.Account.find();
    return accounts.map((x: any) => basicDetails(x));
}

async function getById(id:string) {
    const account = await getAccount(id);
    return basicDetails(account);
}

async function getWalletsById(id:string) {
    const account = await getAccount(id);
    return walletDetails(account);
} 

async function getKeyById(id:string) {
    const account = await getAccount(id);
    return account.recovery;
} 

async function create(params:any) {
    // validate
    if (await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Account(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}

async function update(id: any, params: { 
    email: string; 
    password: string; 
    passwordHash: string; 
    wallets?: Array<any>
    }) {
    const account = await getAccount(id);

    // validate (if email was changed)
    if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = hash(params.password);
    }

    // Handle change wallets and determine if new or existing wallet
    if (params.wallets && account.wallets) {
        let existingKeys = account.wallets.map((wallet:any) => wallet.key)
        params.wallets.forEach((wallet:any) => {

            // Determine with wallet already exists on this account
            if (existingKeys.indexOf(wallet.key) > -1) {

                //Wallet exists and user is trying to remove said wallet
                if (wallet.remove == true) return account.wallets[existingKeys.indexOf(wallet.key)].remove()
                
                // Update wallet with next information
                Object.assign(account.wallets[existingKeys.indexOf(wallet.key)], wallet);
                account.wallets[existingKeys.indexOf(wallet.key)].updated = Date.now();
            } else {
                account.wallets.push(wallet)
            }
        })
        account.wallets.filter(Boolean)
        delete params.wallets
    }

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id: any) {
    const account = await getAccount(id);
    await account.remove();
}

// helper functions

async function getAccount(id: string) {
    if (!db.isValidId(id)) throw 'Account not found';
    const account = await db.Account.findById(id);
    if (!account) throw 'Account not found';
    return account;
}

async function getRefreshToken(token: string) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function hash(password: string) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account: { id: string; }) {
    let secret = env.secret
    if (!secret) return
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, secret, { expiresIn: '3m' });
}

function generateRefreshToken(account: { id: string; }, ipAddress: string) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account: 
    {   id: string; 
        username: string
        role: any; 
        created: string; 
        updated: string; 
        isVerified: boolean; }) {
   
    const { id, username, role, isVerified } = account;
    return { id, username, role, isVerified };
}

function walletDetails(account: 
    {   id: string; 
        username: string;
        wallets: any;
        role: any; 
        created: string; 
        updated: string; 
        isVerified: boolean; }) {
   
    const { id, wallets } = account;
    return { id, wallets };
}

async function sendVerificationEmail(account: { verificationToken: string; email: string; username:string }, origin: any) {
    let message;

    let banner = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/banner-dark_h150.png'
    let twitter = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/twitter_white.png'
    let github = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/github_white.png'
    let discord = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/discord_white.png'
    let facebook = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/facebook_white.png'
    let telegram = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/telegram_white.png'
    let heart = '/Users/intercoder/dev/Projects/WRLD/crossmark/api/assets/png/heart_white.png'

    var html_top_stream = fs.readFileSync("/Users/intercoder/dev/Projects/WRLD/crossmark/api/src/helpers/email-templates/verification_top.html", 'utf8');
    var html_bot_stream = fs.readFileSync("/Users/intercoder/dev/Projects/WRLD/crossmark/api/src/helpers/email-templates/verification_bottom.html", 'utf8');

/*     if (origin) {
        const verifyUrl = `http://${origin}/accounts/verify-email?token=${account.verificationToken}`;
        message = `
        <div class="greetings" style="color: white;margin: 10px 0px;">Hi ${account.username},</div>
        <div class="paragraph" style="color:white;padding:0 50px;text-align:center;margin:10px 0px;">
          One more step and you can run wild! Follow the link below to verify your email and finish settting up your account.
        </div>
        <table width="100%" style="margin:40px auto">
            <tr style="text-align:center">
            <td>
                <a href="${verifyUrl}" 
                style="text-decoration:none;
                color:black;
                background-color:white;
                padding:10px;
                border-radius:10px;
                margin-bottom:40px;
                border:solid 1px transparent;
                margin:100px auto;">Verify Email</a>
            </td>
            </tr>
        </table>`;
    } else { */
        const verifyUrl = `http://localhost:4001/accounts/verify-email?token=${account.verificationToken}`;
        
        message = `
        <div class="greetings" style="color: white;margin: 10px 0px;">Hi ${account.username},</div>
        <div class="paragraph" style="color:white;padding:0 50px;text-align:center;margin:10px 0px;">
          One more step and you can run wild! Use the token below to verify your account.
        </div>
        <table width="100%" style="margin:40px auto">
          <tr style="text-align:center">
            <td>
              <a href="${verifyUrl}" 
              style="text-decoration:none;
              color:black;
              background-color:white;
              padding:10px;
              border-radius:10px;
              margin-bottom:40px;
              border:solid 1px transparent;
              margin:100px auto;">Verify Email</a>
            </td>
          </tr>
        </table>
        <p style="color:white;padding:0 50px;text-align:center;margin:20px 0px;"><code>${account.verificationToken}</code></p>`;

    await sendEmail({
        to: account.email,
        subject: 'Welcome to Crossmark - Verify Your Email',
        attachments: [{
                filename: 'banner.png',
                path: banner,
                cid: 'banner' //same cid value as in the html img src
            },
            {
                filename: 'twitter.png',
                path: twitter,
                cid: 'twitter' //same cid value as in the html img src
            },
            {
                filename: 'github.png',
                path: github,
                cid: 'github' //same cid value as in the html img src
            },
            {
                filename: 'facebook.png',
                path: facebook,
                cid: 'facebook' //same cid value as in the html img src
            },
            {
                filename: 'telegram.png',
                path: telegram,
                cid: 'telegram' //same cid value as in the html img src
            },
            {
                filename: 'discord.png',
                path: discord,
                cid: 'discord' //same cid value as in the html img src
            },
            {
                filename: 'heart.png',
                path: heart,
                cid: 'heart' //same cid value as in the html img src
            }
        ],
        html: `${html_top_stream} ${message} ${html_bot_stream}
                
            <div style='min-height:20px; padding-right:10px;color:rgb(31, 31, 31);text-align:right;font-family:Verdana, "Trebuchet MS", Arial, sans-serif;font-size:8px;'>
                <div>${Date.now()}</div>
            </div>
            </div>
            </body>
            </html>`
    });
}

async function sendAlreadyRegisteredEmail(email: any, origin: any) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        attachments:null,
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

async function sendPasswordResetEmail(account: { resetToken: { token: any; }; email: any; }, origin: any) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/account/reset-password?token=${account.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'Sign-up Verification API - Reset Password',
        attachments:null,
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}

export default {
    authenticate,
    refreshToken,
    revokeToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getWalletsById,
    getById,
    create,
    update,
    delete: _delete,
    checkEmail,
    checkUsername,
    getKeyById
};