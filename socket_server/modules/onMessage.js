const { Message, Contact, FcmTokenSchema } = require("chat_models/node_backend/models/schemas");
const _get = require('lodash.get')
const { createClient } = require("redis");
const moment = require("moment");
const path = require('path')
const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const pathToServiceAccount = path.resolve('/<path to service account json>');
const serviceAccount = require(pathToServiceAccount)

initializeApp({
    credential: cert(serviceAccount)
});


const redisClient = createClient({ host: "localhost", port: 6379 });

const onMessage = async (socket, data) => {
    try {
        redisClient.connect();
        const userId = _get(socket, 'decoded.id');
        const userEmail = _get(socket, 'decoded.email');
        const userName = _get(socket, 'decoded.name');
        const fromText = userName ? userName : userEmail;
        let roomName = '';
        if (userId > data.contactId) {
            roomName = `${userId}-${data.contactId}`;
        } else {
            roomName = `${data.contactId}-${userId}`;
        }
        const room = socket.adapter.rooms.get(roomName);
        const { message, contactId } = data;
        const currentUtcTime = moment.utc().format();
        const messageObj = await new Message({
            senderId: userId,
            userId: userId,
            chatId: roomName,
            receiverId: contactId,
            message,
            time: currentUtcTime
        }).save();

        if (room && messageObj) {
            socket.to(roomName).emit("client-message", messageObj);
        }
        await Contact.findOneAndUpdate({
            userId: contactId,
            contactId: userId,
        }, {
            $set: {
                hasUnreadMessage: true
            }
        });

        const fcmTokenForContact = await FcmTokenSchema.findOne({ userId: data.contactId });
        if (fcmTokenForContact) {
            const fcmToken = fcmTokenForContact.token;
            getMessaging()
                .send({
                    data: {
                        title: `New Message from ${fromText}`,
                        body: message,
                    },
                    notification: {
                        title: `New Message from ${fromText}`,
                        body: message,
                    },
                    "webpush": {
                        "fcm_options": {
                            "link": `${process.env.FRONTEND_BASE_URL}/dashboard/${userId}`
                        },
                    },
                    token: fcmToken
                }).then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        }
    } catch (e) {
        console.log(e);
    } finally {
        console.log('Finally onMessage');
        redisClient.disconnect();
    }
}

module.exports = onMessage;