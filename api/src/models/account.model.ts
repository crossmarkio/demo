import  mongoose from 'mongoose';
const Schema = mongoose.Schema;

const walletSchema = new mongoose.Schema({
    key: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    preferredToken: {
        currency: { type: String },
        issuer: { type: String }
    },
    method: { type: String, required: true },
    keyname: { type: Boolean, default:false},
    created: { type: Date, default: Date.now },
    updated: Date
});

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    recovery: { type: String, required: true },
    wallets: [walletSchema],
    security: {
        reqLoginPin: { type: Boolean, default: false },
        reqLoginPass: { type: Boolean, default: true },
        autoLogout: { type: Boolean, default: false },
        autoLogoutExpiry: Date,
    },
    acceptTerms: Boolean,
    role: { type: String, required: true },
    verificationToken: String,
    verified: Date,
    resetToken: {
        token: String,
        expires: Date
    },
    passwordReset: Date,
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('isVerified').get(function () {
    return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

export default mongoose.model('Account', schema);