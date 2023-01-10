const baseResponse = {
  // Pipe 관련 statusCode
  // IsNotEmpty: 400

  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // DB ERROR
  DB_ERROR: { statusCode: 200, message: 'DB_ERROR' },
};

export default baseResponse;
