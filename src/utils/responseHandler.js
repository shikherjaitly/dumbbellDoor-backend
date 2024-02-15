const responseHandler = (res, statusCode, successMessage) => {
  return res
    .status(statusCode)
    .json({ success: true, message: successMessage });
};

export default responseHandler;
