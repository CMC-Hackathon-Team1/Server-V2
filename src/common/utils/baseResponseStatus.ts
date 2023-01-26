const baseResponse = {
  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // PIPE ERROR
  PIPE_ERROR_EXAMPLE: { statusCode: 400, message: ['... must be a string'], error: 'Bad Request' },

  // JWT ERROR
  JWT_UNAUTHORIZED: { statusCode: 401, message: 'Unauthorized' },

  // DB, Server ERROR
  SERVER_ERROR: { statusCode: 500, message: 'Internal_Server_ERROR' },
  DB_ERROR: { statusCode: 501, message: 'DB ERROR' },

  // -- 파트별로 1000번대부터 500개씩 나눠서 --

  // 인증 관련
  AUTH_COOKIE_JWT_EMPTY: { statusCode: 1000, message: '쿠키에 jwt가 없습니다.' },
  TOKEN_VERIFICATION_FAILURE: { statusCode: 1001, message: 'JWT 토큰 검증 실패' },

  KAKAO_LOGIN_FAILED: { statusCode: 1010, message: '카카오 로그인에 실패했습니다.' },
  KAKAO_AUTH_CODE_EMPTY: { statusCode: 1011, message: '카카오 인가코드가 없습니다.' },
  KAKAO_ACCESS_TOKEN_FAIL: { statusCode: 1012, message: '카카오 인증토큰을 받는데 실패하였습니다.' },
  KAKAO_ACCESS_TOKEN_EMPTY: { statusCode: 1013, message: '카카오 인증토큰이 없습니다.' },
  KAKAO_USER_INFO_FAIL: { statusCode: 1014, message: '카카오 유저 정보를 불러오는데 실패하였습니다.' },
  KAKAO_LOGOUT_FAILED: { statusCode: 1015, message: '카카오 로그아웃에 실패했습니다.' },

  GOOGLE_LOGIN_FAILED: { statusCode: 1020, message: '카카오 로그인에 실패했습니다.' },
  GOOGLE_AUTH_FAILED: { statusCode: 1021, message: '구글 인증에 실패했습니다.' },
  GOOGLE_AUTH_USER_FAILED: { statusCode: 1022, message: '구글 사용자 정보 확인에 실패했습니다.' },

  // 회원, 계정 관련
  USER_ALREADY_EXISTS: { statusCode: 1100, message: '이미 가입된 회원입니다.' },
  USER_NOT_FOUND: { statusCode: 1101, message: '회원 정보가 없습니다. 이메일과 비밀번호를 올바르게 입력했는지 확인하세요.' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 1500, message: '사용자 프로필은 3개까지 생성 가능합니다.' },
  PROFILE_SAME_PERSONA: { statusCode: 1501, message: '사용자에게 해당 페르소나가 이미 존재합니다.' },
  PROFILE_NOT_EXIST: { statusCode: 1502, message: '해당 프로필은 존재하지 않습니다.' },
  USER_NO_PROFILE: { statusCode: 1503, message: '해당 사용자는 프로필이 존재하지 않습니다.' },
  PROFILE_NO_AUTHENTICATION: { statusCode: 1504, message: '해당 프로필에 대한 권한이 없습니다.' },


  // 좋아요 관련
  POST_LIKE:{statusCode:2000,message:'Like'},
  DELETE_LIKE:{statusCode:2001,message:"didn't Like"},


  //팔로우 관련
  POST_FOLLOW:{statusCode:2101,message:'Follow'},
  DELETE_FOLLOW:{statusCode:2102,message:'Unfollow'}
};

export default baseResponse;