const { Contact } = require("chat_models/node_backend/models/schemas");
const _get = require('lodash.get')
const { createClient } = require("redis");

const { redisActiveUsersKey } = require('../constants/constants');

const redisClient = createClient({ host: "localhost", port: 6379 });


const createRooms = async (userId, socket) => {

    try {
        let usersOnline = await redisClient.get(redisActiveUsersKey);
        usersOnline = JSON.parse(usersOnline);

        const query = {
            userId: userId
        };

        const userContacts = await Contact.find(query);
        const createRoomsFor = [];
        userContacts.forEach(item => {
            if (usersOnline[item.contactId.toString()]) {
                createRoomsFor.push({
                    id: item.contactId.toString(),
                });
            }
        });

        createRoomsFor.forEach(item => {
            let roomName = '';
            if (userId > item.id) {
                roomName = `${userId}-${item.id}`;
            } else {
                roomName = `${item.id}-${userId}`;
            }
            socket.join(roomName);
        });

    } catch (e) {
        console.log(e);
    } finally {
        console.log('Finally createRooms');
        redisClient.disconnect();
    }
};

const onConnect = async socket => {
    try {
        redisClient.connect();
        const userId = _get(socket, 'decoded.id');
        let temp = await redisClient.get(redisActiveUsersKey);
        if (!temp) {
            temp = {}
        } else {
            temp = JSON.parse(temp);
        }
        temp[userId] = true;
        await redisClient.set(redisActiveUsersKey, JSON.stringify(temp));
        createRooms(userId, socket)
    } catch (e) {
        console.log(e);
    } finally {
        console.log('Finally onConnect');
    }
}

module.exports = onConnect;
