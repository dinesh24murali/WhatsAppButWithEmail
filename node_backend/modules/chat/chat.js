const express = require('express');

const { User, Contact, Message, FcmTokenSchema } = require('../../models/schemas');
const Response = require('../../helpers/Response')
const { prepareRoomId } = require('../../helpers/chat')
const { messagesPerPage } = require('../../helpers/constants')
const verifyRequest = require('../../helpers/auth');

const router = express.Router();

router.post('/get_chat/:contactId', verifyRequest, async (req, res) => {
    try {
        const {
            id,
        } = req.user;
        const contact = await User.findOne({ _id: req.params.contactId });
        if (!contact) return res.status(400).send(new Response(false, "Contact not found"));
        const {
            pageNo,
        } = req.body;
        const roomName = prepareRoomId(id, contact.id)
        let messages = await Message.find({ chatId: roomName })
            .sort({ time: -1 })
            .skip(pageNo > 0 ? ((pageNo - 1) * messagesPerPage) : 0)
            .limit(messagesPerPage);
        messages = messages.reverse();
        res.send(new Response(true, "Chat retrieved successfully", messages));
    } catch (error) {
        res
            .status(400)
            .send(new Response(false, "Something went wrong", error));
    }
});

router.put('/mark_as_read/:contactId', verifyRequest, async (req, res) => {
    try {
        const {
            id,
        } = req.user;
        const contact = await User.findOne({ _id: req.params.contactId });
        if (!contact) return res.status(400).send(new Response(false, "Contact not found"));
        await Contact.findOneAndUpdate({
            userId: id,
            contactId: req.params.contactId,
        }, {
            $set: {
                hasUnreadMessage: false
            }
        })
        res.send(new Response(true, "Mark as read successfully", {}));
    } catch (error) {
        res
            .status(400)
            .send(new Response(false, "Something went wrong", error));
    }
});

router.post('/create_or_update_fcm_token', verifyRequest, async (req, res) => {
    try {
        const {
            id,
        } = req.user;
        const {
            token,
        } = req.body;

        const userToken = await FcmTokenSchema.findOne({
            userId: id
        });
        if (userToken) {
            await FcmTokenSchema.findOneAndUpdate({
                userId: id
            }, {
                $set: {
                    token,
                }
            });
        } else {
            await new FcmTokenSchema({
                userId: id,
                token: token,
            }).save();
        }
        res.send(new Response(true, "Saved token successfully", {}));
    } catch (error) {
        res
            .status(400)
            .send(new Response(false, "Something went wrong", error));
    }
});

module.exports = router;
