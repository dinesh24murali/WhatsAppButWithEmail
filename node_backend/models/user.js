const Joi = require('joi');

const userValidator = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(100),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .required(),
    profilePic: Joi.string()
        .uri(),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required(),
    isEmailVerified: Joi.boolean(),
});

module.exports = {
    userValidator,
}
