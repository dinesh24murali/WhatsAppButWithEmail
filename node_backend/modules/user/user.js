const express = require('express');
const jwt = require('jsonwebtoken');
const SHA256 = require("crypto-js/sha256");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const { User, Token, Contact } = require('../../models/schemas');
const { userValidator } = require('../../models/user');
const Response = require('../../helpers/Response')
const verifyRequest = require('../../helpers/auth')
const { tokenValidity } = require('../../helpers/constants')
const router = express.Router();
const { sendVerificationEmail } = require('../../tasks/auth');

const createUserToken = async userId => {
    return await new Token({
        userId: userId,
        token: SHA256(Math.floor(Math.random() * 100000)).toString(),
    }).save();
};

router.post('/register_user', async (req, res) => {

    try {

        const {
            email,
        } = req.body;

        const { error, value } = userValidator.validate({
            email,
            password: `passWord$${Math.floor(Math.random() * 100000)}`,
            isEmailVerified: false,
        });

        if (error) {
            res.status(404).send(new Response(false, 'User registration failed', error));
            return;
        }
        let user = await User.findOne({ email });
        if (user)
            return res.status(400).send(new Response(false, "User with given email already exist! Please login"));

        user = await new User(value).save();
        let token = await createUserToken(user._id);

        const verifyUrl = `${process.env.FRONTEND_BASE_URL}/verify_email/${user.id}/${token.token}`;

        console.log(verifyUrl);
        res.status(200).send(new Response(true, 'User registered successfully'));
        sendVerificationEmail({
            toAddress: email,
            verifyUrl,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(new Response(false, 'Internal server error', e));
    }
})

router.post('/resend_verify_email', async (req, res) => {

    try {

        const {
            email,
        } = req.body;

        let user = await User.findOne({ email });
        let token;
        if (user) {
            token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await createUserToken(user._id);
            }
        } else {
            const { error, value } = userValidator.validate({
                email,
                password: `passWord$${Math.floor(Math.random() * 100000)}`,
                isEmailVerified: false,
            });
            if (error) {
                res.status(404).send(new Response(false, 'User registration failed', error));
                return;
            }
            user = await new User(value).save();
            token = await createUserToken(user._id);
        }

        const verifyUrl = `${process.env.FRONTEND_BASE_URL}/verify_email/${user.id}/${token.token}`;

        res.status(200).send(new Response(true, 'User registered successfully'));
        sendVerificationEmail({
            toAddress: email,
            verifyUrl,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(new Response(false, 'Internal server error', e));
    }
})


router.get('/verify/:id/:token', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send(new Response(false, "Invalid link", error));

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send(new Response(false, "Invalid link", error));

        await User.updateOne({ _id: user._id }, { isEmailVerified: true });
        await Token.findByIdAndRemove(token._id);

        res.send(new Response(true, "Email verified successfully"));
    } catch (error) {
        res
            .status(400)
            .send(new Response(false, "Something went wrong", error));
    }
});

router.post('/login', (req, res) => {
    try {
        const {
            password,
            email
        } = req.body;

        User.find({
            email,
            password: SHA256(password).toString(),
        }, async (err, data) => {
            if (err) {
                res.status(500)
                    .send(new Response(false, err));
            } else if (data) {
                const [first] = data;
                if (!first) {
                    res.status(200)
                        .send(new Response(false, 'Invalid email or password'));
                    return;
                }
                const payload = {
                    id: first.id,
                    email: first.email,
                }
                const token = await jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    {
                        expiresIn: tokenValidity
                    });
                const response = {
                    token: token,
                    user: {
                        id: first.id,
                        name: first.name,
                        email: first.email,
                        isEmailVerified: first.isEmailVerified,
                    }
                }
                res.send(new Response(true, 'Success', response));
            } else {
                res.status(500)
                    .send(new Response(false, 'Error', err));
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500)
            .send(new Response(false, 'Error', e));
    }
});

router.get('/user', verifyRequest, (req, res) => {
    try {
        const {
            id,
        } = req.user;
        User.findById(id, (err, data) => {
            if (err) {
                res.status(500);
                res.send(new Response(false, err));
            } else if (data) {
                if (!data) {
                    res.status(200);
                    res.send(new Response(false, 'User not found'));
                    return;
                }
                res.send(new Response(true, 'Success', {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    isEmailVerified: data.isEmailVerified,
                }));
            }
        });
    } catch (e) {
        console.log(e);
        res.send(new Response(false, 'Error', e));
    }
});

router.put('/update_password', (req, res) => {
    try {
        const {
            id,
            password,
        } = req.body;

        User.findById(id, async (err, data) => {
            if (err) {
                res.status(500);
                res.send(new Response(false, err));
            } else if (data) {
                await User.updateOne({ _id: data._id }, {
                    password: SHA256(password).toString()
                });
                res.send(new Response(true, 'Updated password successfully'));
            }
        });
    } catch (e) {
        console.log(e);
        res.send(new Response(false, 'Error', e));
    }
});

router.get('/user_contacts', verifyRequest, (req, res) => {
    try {
        Contact.find({
            userId: req.user.id,
        }, async (err, data) => {
            if (err) {
                res.status(500);
                res.send(new Response(false, err));
            } else if (data) {
                const temp = data.map(item => ObjectId(item.contactId))
                User.find({ _id: { $in: temp } }, (error, response) => {
                    const tempContacts = response;
                    res.send(new Response(true, 'Success', tempContacts.map(item => {
                        let hasUnreadMessage = data.find(tempItem => tempItem.contactId.toLocaleString() === item.id);
                        if (hasUnreadMessage) {
                            hasUnreadMessage = hasUnreadMessage.hasUnreadMessage ? true : false;
                        } else {
                            hasUnreadMessage = undefined;
                        }
                        return {
                            id: item.id,
                            name: item.name,
                            email: item.email,
                            hasUnreadMessage,
                            isEmailVerified: item.isEmailVerified,
                        }
                    })));
                });
            }
        });
    } catch (e) {
        console.log(e);
        res.send(new Response(false, 'Error', e));
    }
});

router.post('/add_contact', verifyRequest, async (req, res) => {
    try {
        const {
            email,
        } = req.body;

        const tempUser = await User.findOne({ email });
        if (tempUser) {
            await new Contact({
                userId: req.user.id,
                contactId: tempUser.id,
                hasUnreadMessage: false
            }).save();
            res.send(new Response(true, 'Successfully added contact'));
            return;
        }
        res.send(new Response(false, 'Email not found. You can send an invite'));
    } catch (e) {
        console.log(e);
        res.send(new Response(false, e.code === 11000 ? 'This email is already in you contact!' : 'Error', e));
    }
});

module.exports = router;
