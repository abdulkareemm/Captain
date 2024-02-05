const { Server } = require("socket.io");
let io;
module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: "*",
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("not initailize");
    }
    return io;
  },
};
