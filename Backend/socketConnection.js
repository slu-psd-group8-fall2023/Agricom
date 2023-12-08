function emitMessage(message, data) {
    const { io } = require("./app");
    io.emit(message, data);
}

module.exports = {
    emitMessage
}
