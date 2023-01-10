export const response = ({ statusCode, message }, result?: any) => {
  if (result) {
    return {
      statusCode: statusCode,
      message: message,
      result: result,
    };
  } else {
    return {
      statusCode: statusCode,
      message: message,
    };
  }
};

export const errResponse = ({ statusCode, message }) => {
  return {
    statusCode: statusCode,
    message: message,
  };
};
