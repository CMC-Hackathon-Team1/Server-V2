const AlarmContents = {
  /**
   * 팔로우 신청
   * @param from 팔로우 신청자
   * @param to 팔로우 대상
   * @returns 푸시 알림 데이터
   */
  FOLLOW: (from: string, to: string): AlarmMessageModel => {
    return {
      notification: {
        title: 'On&Off',
        body: `${from}님이 ${to}님을 팔로우 하였습니다.`,
      },
    };
  },

  /**
   * 공지사항 추가 알림
   */
  NOTICE: (): AlarmMessageModel => {
    return {
      notification: {
        title: 'On&Off',
        body: '공지사항이 추가되었습니다. 공지사항을 확인해주세요.',
      },
    };
  },

  /**
   * 팔로잉한 유저의 게시글 알림
   * @param follower 팔로우 중인 프로필
   * @returns 푸시 알림 데이터
   */
  FOLLOWING_NEW_FEED: (follower: string): AlarmMessageModel => {
    return {
      notification: {
        title: 'On&Off',
        body: `${follower}님의 새 게시물이 업데이트 되었습니다.`,
      },
    };
  },

  /**
   * 좋아요 알림
   * @param from 좋아요 누른 프로필
   * @param to 좋아요를 받은 프로필
   * @returns 푸시 알림 데이터
   */
  LIKE: (from: string, to: string): AlarmMessageModel => {
    return {
      notification: {
        title: 'On&Off',
        body: `${from}님이 ${to}님의 게시글을 좋아합니다.`,
      },
    };
  },
};

export default AlarmContents;
