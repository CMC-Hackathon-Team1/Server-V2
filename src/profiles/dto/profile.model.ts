export interface ProfileModel {
  profileId: number;
  userId: number;
  profileName: string;
  personaId: number;
  profileImgUrl: string;
  statusMessage: string;
  createdAt: Date;
}

export interface ProfileResponseModel {
  profileId: number;
  userId: number;
  profileName: string;
  personaName: string;
  profileImgUrl: string;
  statusMessage: string;
  createdAt: Date;
}

export const ProfileModelExample = {
  profileId: 30,
  profileName: '(프로필 이름)',
  personaId: 1,
  profileImgUrl: '(프로필 이미지)',
  statusMessage: '(프로필 상태 메시지)',
  createdAt: '(프로필 생성 날짜)',
};

export const ProfileResponseModelExample = {
  profileId: 29,
  personaName: '(페르소나 이름)',
  profileName: '(프로필 이름)',
  statusMessage: '(프로필 상태 메시지)',
  profileImgUrl: '(프로필 이미지)',
  createdAt: '(프로필 생성 날짜)',
};
