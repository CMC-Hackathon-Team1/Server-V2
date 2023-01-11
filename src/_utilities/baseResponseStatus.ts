const baseResponse = {
  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // Request Error: 201 ~ 299
  PROFILE_COUNT_OVER: { statusCode: 201, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
  PROFILE_SAME_PERSONA: { statusCode: 201, message: '사용자에게 해당 페르소나가 이미 존재합니다.' },

  // Response Error: 301 ~ 399
  
  // Pipe Error
  // { statusCode: 400, message: (각 Pipe에 의해 메시지 출력), error: 'Bad Request' }
  
  // Servier Error
  // { statusCode: 500, message: 'Internal server error' }
  DB_ERROR: { statusCode: 501, message: 'DB_ERROR' },
};

export default baseResponse;
