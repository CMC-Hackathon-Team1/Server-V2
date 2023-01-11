const baseResponse = {
  // Pipe 관련 statusCode
  // { statusCode: 400, message: (각 Pipe에 의해 메시지 출력), error: 'Bad Request' }

  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // 서버 Error
  DB_ERROR: { statusCode: 200, message: 'DB_ERROR' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 300, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
  PROFILE_SAME_PERSONA: { statusCode: 301, message: '사용자에게 해당 페르소나가 이미 존재합니다.' },
};

export default baseResponse;
