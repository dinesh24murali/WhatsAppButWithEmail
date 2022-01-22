const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
require('dotenv').config();


async function main() {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
}

main().catch(err => console.log(err));

const UserSchema = new Schema({
    name: { type: String },
    profilePic: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false }
});

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const fcmTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const contactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    contactId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    hasUnreadMessage: Schema.Types.Boolean,
});
contactSchema.index({ "userId": 1, "contactId": 1 }, { "unique": true })

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    chatId: {
        type: Schema.Types.String,
        required: true,
    },
    userId: {
        type: Schema.Types.String,
        required: true,
    },
    time: {
        type: Schema.Types.Date,
        required: true,
    },
    message: Schema.Types.String
});

module.exports = {
    User: mongoose.model('user', UserSchema),
    Token: mongoose.model('token', tokenSchema),
    FcmTokenSchema: mongoose.model('fcm_token', fcmTokenSchema),
    Contact: mongoose.model('contact', contactSchema),
    Message: mongoose.model('message', messageSchema),
}
