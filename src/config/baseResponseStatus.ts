const baseResponse = {
  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // 서버, Pipe 등 관련 statusCode -> 400~500번대

  // DB ERROR
  DB_ERROR: { statusCode: 500, message: 'DB_ERROR' },

  // 회원, 계정 관련
  AUTH_COOKIE_JWT_EMPTY: { statusCode: 1000, message: '쿠키에 jwt가 없습니다.' },
  TOKEN_VERIFICATION_FAILURE: { statusCode: 1001, message: 'JWT 토큰 검증 실패' },

  USER_ALREADY_EXISTS: { statusCode: 1010, message: '이미 가입된 회원입니다.' },
  USER_NOT_FOUND: { statusCode: 1011, message: '회원 정보가 없습니다. 이메일과 비밀번호를 올바르게 입력했는지 확인하세요.' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 1050, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
};

export default baseResponse;
