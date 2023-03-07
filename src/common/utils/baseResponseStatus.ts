const baseResponse = {
  // SUCCESS
  SUCCESS: { statusCode: 100, message: 'SUCCESS' },

  // PIPE ERROR
  PIPE_ERROR_EXAMPLE: { statusCode: 400, message: ['... must be a string'], error: 'Bad Request' },
  PARSEINT_PIPE_ERROR_EXAMPLE: { statusCode: 400, message: ['Validation failed (numeric string is expected'], error: 'Bad Request' },

  // JWT ERROR
  JWT_UNAUTHORIZED: { statusCode: 401, message: 'Unauthorized' },

  // DB, Server ERROR
  SERVER_ERROR: { statusCode: 500, message: 'Internal server error' },
  DB_ERROR: { statusCode: 501, message: 'DB ERROR' },

  // -- 파트별로 1000번대부터 500개씩 나눠서 --

  // 인증 관련
  AUTH_COOKIE_JWT_EMPTY: { statusCode: 1000, message: '쿠키에 jwt가 없습니다.' },
  TOKEN_VERIFICATION_FAILURE: { statusCode: 1001, message: 'JWT 토큰 검증 실패' },
  USER_AUTH_WRONG: { statusCode: 1002, message: '회원 인증에 실패했습니다.' },
  USER_WRONG_STATUS: { statusCode: 1003, message: '회원 인증 상태에 문제가 있습니다.' },
  EMAIL_NOTIFICATION_FAILED: { statusCode: 1004, message: '이메일 인증이 완료되지 않았습니다.' },
  EMAIL_NOTIFICATION_EXPIRED: { statusCode: 1005, message: '이메일 인증이 만료되었습니다. 다시 요청하세요.' },
  EMAIL_AUTH_RENDER_FAILED: { statusCode: 1006, message: '이메일 폼 오류' },
  EMAIL_SEND_FAILED: { statusCode: 1007, message: '이메일 인증 메일 보내기 실패' },

  KAKAO_LOGIN_FAILED: { statusCode: 1010, message: '카카오 로그인에 실패했습니다.' },
  KAKAO_AUTH_CODE_EMPTY: { statusCode: 1011, message: '카카오 인가코드가 없습니다.' },
  KAKAO_ACCESS_TOKEN_FAIL: { statusCode: 1012, message: '카카오 인증토큰을 받는데 실패하였습니다.' },
  KAKAO_ACCESS_TOKEN_EMPTY: { statusCode: 1013, message: '카카오 인증토큰이 없습니다.' },
  KAKAO_USER_INFO_FAIL: { statusCode: 1014, message: '카카오 유저 정보를 불러오는데 실패하였습니다.' },
  KAKAO_LOGOUT_FAILED: { statusCode: 1015, message: '카카오 로그아웃에 실패했습니다.' },

  GOOGLE_LOGIN_FAILED: { statusCode: 1020, message: '구글 로그인에 실패했습니다.' },
  GOOGLE_ID_TOKEN_EMPTY: { statusCode: 1021, message: '구글 인증토큰이 없습니다.' },
  GOOGLE_ID_TOKEN_INVALID: { statusCode: 1022, message: '구글 인증토큰 검증에 실패했습니다.' },
  GOOGLE_AUTH_FAILED: { statusCode: 1023, message: '구글 인증에 실패했습니다.' },
  GOOGLE_AUTH_USER_FAILED: { statusCode: 1024, message: '구글 사용자 정보 확인에 실패했습니다.' },

  APPLE_LOGIN_FAILED: { statusCode: 1030, message: '애플 로그인에 실패했습니다.' },
  APPLE_ID_TOKEN_EMPTY: { statusCode: 1031, message: '애플 인증토큰이 없습니다.' },
  APPLE_ID_TOKEN_INVALID: { statusCode: 1032, message: '애플 인증토큰 검증에 실패했습니다.' },

  // 회원, 계정 관련
  USER_ALREADY_EXISTS: { statusCode: 1100, message: '이미 가입된 회원입니다.' },
  USER_NOT_FOUND: { statusCode: 1101, message: '회원 정보가 없습니다.' },
  WRONG_LOGIN: { statusCode: 1102, message: '다른 플랫폼으로 가입된 회원입니다.' },
  USER_STATUS_ERROR: { statusCode: 1103, message: '요청 Body가 잘못되었습니다.' },
  USER_LOGOUT_FAILED: { statusCode: 1104, message: '로그아웃에 실패했습니다.' },

  // 프로필 관련
  PROFILE_COUNT_OVER: { statusCode: 1500, message: '사용자 프로필은 5개까지 생성 가능합니다.' },
  PROFILE_SAME_PERSONA: { statusCode: 1501, message: '사용자에게 해당 페르소나가 이미 존재합니다.' },
  PROFILE_NOT_EXIST: { statusCode: 1502, message: '해당 프로필은 존재하지 않습니다.' },
  USER_NO_PROFILE: { statusCode: 1503, message: '해당 사용자는 프로필이 존재하지 않습니다.' },
  PROFILE_NO_AUTHENTICATION: { statusCode: 1504, message: '해당 프로필에 대한 권한이 없습니다.' },
  PROFILE_ID_NOT_FOUND: { statusCode: 1505, message: '프로필 ID를 입력해주세요.' },
  PROFILE_NOT_MATCH: { statusCode: 1506, message: '사용자 계정과 프로필이 일치하지 않습니다.' },

  // 좋아요 관련
  POST_LIKE:{statusCode:2000,message:'Like'},
  DELETE_LIKE:{statusCode:2001,message:"didn't Like"},

  //팔로우 관련
  POST_FOLLOW:{statusCode:2101,message:'Follow'},
  DELETE_FOLLOW:{statusCode:2102,message:'Unfollow'},
  FROM_PROFILE_ID_NOT_FOUND:{statusCode:2103,message:'From Profile Id가 존재하지 않는 id입니다.'},
  TO_PROFILE_ID_NOT_FOUND: { statusCode: 2104, message: 'To Profile Id가 존재하지 않는 id입니다.' },
  FOLLOWER_NOT_EXIST:{statusCode:2105,message:'해당 유저가 팔로우하고있는 유저가 존재하지 않습니다.'},
  // 게시글 관련
  FEED_NOT_FOUND: { statusCode: 2200, message: '해당 게시물이 존재하지 않습니다.' },
  FEED_NO_AUTHENTICATION:{statusCode:2201,message:'해당 게시물에 대한 권한이 없습니다.'},
  FEED_CONTENT_TO_MANY_CHARACTERS:{statusCode:2202,message:'게시글은 2000글자 이하까지만 허용됩니다.'},
  FEED_IS_SECRET_CAN_HAVE_PUBLIC_OR_PRIVATE:{statusCode:2203,message:'게시글의 isSecret으로는 PUBLIC OR PRIVATE만 가능합니다..'},
  FEED_CAN_HAVE_20_HASHTAGS:{statusCode:2204,message:'게시글은 최대 20개까지 해시태그를 가질 수 있습니다.'},
  FEED_IMG_COUNT_OVER:{statusCode:2205,message:'게시글이미지는 최대 5개로 제한됩니다.'},
  FEED_HAVE_CONTENT_OR_IMAGE:{statusCode:2206,message:'게시글은 내용 OR 이미지 중 적어도 하나는 가져야 합니다.'},
  PAGE_UPPER_ZERO:{statusCode:2206,message:'페이지 넘버는 1이상이여야 합니다.'},

  // 월별 게시글 조회 관련
  MONTHLY_EMPTY_BASE_PROFILE_ID: { statusCode: 2301, message: 'baseProfileId는 필수로 입력하여야 합니다.' },
  MONTHLY_EMPTY_TARGET_PROFILE_ID: { statusCode: 2302, message: 'targetProfileId는 필수로 입력하여야 합니다.' },
  MONTHLY_EMPTY_YEAR: { statusCode: 2303, message: 'year는 필수로 입력하여야 합니다.' },
  MONTHLY_EMPTY_MONTH: { statusCode: 2304, message: 'month는 필수로 입력하여야 합니다.' },
  MONTHLY_EMPTY_PAGE: { statusCode: 2305, message: 'page는 필수로 입력하여야 합니다.' },

  // 검색 관련
  HASHTAG_NOT_FOUND: { statusCode: 2500, message: '해시태그를 입력해주세요.' },

  // 수치화 관련

  // 신고 관련
  FEED_ALREADY_REPORTED: { statusCode: 3000, message: '이미 신고된 게시글 입니다.' },
  INVALID_REPORT_CATEGORY: { statusCode: 3001, message: '올바르지 않은 신고 분류 입니다.' },
  REPORT_CONTENT_EMPTY: { statusCode: 3002, message: '신고 사유가 (6. 기타 부적절한 글)인 경우 기타 신고 사유를 입력해야 합니다.' },
};

export default baseResponse;
