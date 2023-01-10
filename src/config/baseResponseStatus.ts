const baseResponse = {
  // Pipe 관련 statusCode
  // IsNotEmpty: 400

  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // 프로필 관련
  PROFILE_COUNT_OVER: {statusCode: 200, message: '사용자 프로필은 3개까지 생성 가능합니다.'},

  // DB ERROR
  DB_ERROR: { statusCode: 300, message: 'DB_ERROR' },
};

export default baseResponse;
