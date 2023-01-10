const baseResponse = {
  // SUCCESS
  SUCCESS: { isSuccess: true, code: 100, message: 'SUCCESS' },

  // DB ERROR
  DB_ERROR: { isSuccess: false, code: 200, message: 'DB_ERROR' },
};

export default baseResponse;
