const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/error.controller");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/comments", require("./routes/comment"));
app.use("/api/v1/cart", require("./routes/cart"));
app.use("/api/v1/chat", require("./routes/chatroom"));

//404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
