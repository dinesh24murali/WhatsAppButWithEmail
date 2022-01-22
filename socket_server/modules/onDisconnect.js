const _get = require('lodash.get')
const { createClient } = require("redis");
const redisClient = createClient({ host: "localhost", port: 6379 });
redisClient.connect();

const { redisActiveUsersKey } = require('../constants/constants');

const onDisconnect = async socket => {
    try {
        const userId = _get(socket, 'decoded.id');
        if (!userId) {
            return;
        }
        // const currentUser = await User.findById(userId);
        let temp = await redisClient.get(redisActiveUsersKey);
        if (!temp) {
            temp = {}
        } else {
            temp = JSON.parse(temp);
        }
        delete temp[userId];
        await redisClient.set(redisActiveUsersKey, JSON.stringify(temp));
    } catch (e) {
        console.log(e);
    }
}

module.exports = onDisconnect;
