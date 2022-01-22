

function prepareRoomId(userId, contactId) {

    let roomName;
    if (userId > contactId) {
        roomName = `${userId}-${contactId}`;
    } else {
        roomName = `${contactId}-${userId}`;
    }
    return roomName;
}

module.exports = {
    prepareRoomId,
}
