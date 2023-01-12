const baseResponse = {
  // Pipe 관련 statusCode
  // IsNotEmpty: 400

  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // DB ERROR
  DB_ERROR: { statusCode: 200, message: 'DB_ERROR' },

  // 회원, 계정 관련
  USER_ALREADY_EXISTS: { statusCode: 300, message: '이미 가입된 회원입니다.' },
  USER_NOT_FOUND: { statusCode: 301, message: '회원 정보가 없습니다. 이메일과 비밀번호를 올바르게 입력했는지 확인하세요.' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 400, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
};

export default baseResponse;
