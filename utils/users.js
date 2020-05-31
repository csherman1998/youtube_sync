const users = [];

//join user to chat

function userJoin(id, username, roomName) {
    const user = {id, username, roomName};
    users.push(user);

    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id = id);
}

module.exports = {
    userJoin,
    getCurrentUser
};