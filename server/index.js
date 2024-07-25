const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const authRouter = require("./routes/AuthRoutes");
const contactRouter = require("./routes/ContactRoutes");
const messageRouter = require("./routes/MessageRoute");
const channelRouter = require("./routes/ChannelRoute");
const { setupSocket } = require("./socket");
const app = express();
const port = process.env.PORT || 5000;
const whitelist = [process.env.ORIGIN];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false, credentials: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
dbConnect();
app.use(morgan("dev"));

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/upload/profile", express.static("upload/profile"));
app.use("/upload/files", express.static("upload/files"));
app.use("/api/user", authRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);
app.use("/api/channel", channelRouter);
app.use(notFound);
app.use(errorHandler);
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running  at PORT ${port}`);
});
setupSocket(server);
