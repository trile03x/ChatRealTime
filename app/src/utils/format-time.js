const formatTime = require("date-format");
const createAt = (mess, user) => {
    return {
        user,
        mess,
        createAt: formatTime("dd-MM-yyyy, hh:mm:ss ")
    }
};
module.exports = {
    createAt
}