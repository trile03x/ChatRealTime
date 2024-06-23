let userList = [];
const getUserList = (room) => {
    return userList.filter((user) => user.room === room);
};
const addUser = (newUser) => {
    userList = [...userList, newUser];
};
const removeUser = (id) => {
    return userList = userList.filter((user) => user.id !== id);
}
const findUser = (id) => {
    return userList.find((user) => user.id === id);
}
module.exports = {
    getUserList,
    addUser,
    removeUser,
    findUser
}
