const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const { port } = require("./config");
const { createServer } = require("http");
const httpServer = createServer(app);

app.use("/image", express.static(path.join(__dirname, "image")));
app.use(require("./middleware/image"));

// IMPORTANT IN DEV MODE
app.use(require("./middleware/header"));

require("./config/db/mongoose")(app);
require("./app/routes-handler")(app);
httpServer.listen(process.env.PORT || 3500, () => {
  console.log(`Connected to server on port ${port}`);
});
const io = require("./config/socket.io").init(httpServer);
io.on("connection", (socket) => {
  socket.on("login_waiter", (waiterId) => {
    //console.log("waiter login");
    socket.join(waiterId);
  });
  socket.on("login_kitchen", (kitchenId) => {
    socket.join(kitchenId);
    console.log(` kitchen id${kitchenId}`);
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
