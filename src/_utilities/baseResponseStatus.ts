const baseResponse = {
  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // 서버, Pipe 등 관련 statusCode -> 400~500번대
  // { statusCode: 400, message: (각 Pipe에 의해 메시지 출력), error: 'Bad Request' }

  // DB,Server ERROR
  // { statusCode: 500, message: 'Internal server error' }
  DB_ERROR: { statusCode: 501, message: 'DB_ERROR' },

  // -- 파트별로 1000번대부터 500개씩 나눠서 --

  // 인증 관련
  AUTH_COOKIE_JWT_EMPTY: { statusCode: 1000, message: '쿠키에 jwt가 없습니다.' },
  TOKEN_VERIFICATION_FAILURE: { statusCode: 1001, message: 'JWT 토큰 검증 실패' },

  // 회원, 계정 관련
  USER_ALREADY_EXISTS: { statusCode: 1010, message: '이미 가입된 회원입니다.' },
  USER_NOT_FOUND: { statusCode: 1011, message: '회원 정보가 없습니다. 이메일과 비밀번호를 올바르게 입력했는지 확인하세요.' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 1500, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
  PROFILE_SAME_PERSONA: { statusCode: 1501, message: '사용자에게 해당 페르소나가 이미 존재합니다.' },
};

export default baseResponse;
