export const response = ({ isSuccess, code, message }, result?: any) => {
  if (result) {
    return {
      isSuccess: isSuccess,
      code: code,
      message: message,
      result: result,
    };
  } else {
    return {
      isSuccess: isSuccess,
      code: code,
      message: message,
    };
  }
};

export const errResponse = ({ isSuccess, code, message }) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
  };
};
