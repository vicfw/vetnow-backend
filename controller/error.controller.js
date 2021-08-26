const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  console.log(err);
  const message = `Invalid Request`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  console.log(value);
  const message = `مقدار ${value} تکراری میباشد . لطفا مقدار غیر تکراری جایگزین کنید.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(errors, "error");
  const message = `${errors.join(".\n ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("توکن شما منقضی شد.لطفا دوباره وارد شوید.", 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    console.log(err);
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
