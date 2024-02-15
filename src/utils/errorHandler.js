const errorHandler = (res, statusCode, errorMessage) => {
  return res.status(statusCode).json({ success: false, message: errorMessage });
};

export default errorHandler;
