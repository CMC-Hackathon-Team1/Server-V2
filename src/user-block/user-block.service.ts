// import { Injectable } from '@nestjs/common';
// import { UserBlock } from '../common/entities/ProfileBlock';
// import baseResponse from '../common/utils/baseResponseStatus';
// import { errResponse, sucResponse } from '../common/utils/response';
// import { UsersRepository } from '../users/users.repository';
// import { UserBlockRepository } from './user-block.repository';

// @Injectable()
// export class UserBlockService {
//     constructor(
//         private usersRepository: UsersRepository,
//         private userBlockRepository: UserBlockRepository,
//     ){};

//     async blockUser(fromUserId: any, toUserId: any) {
//         try {
//             const isExistFromUser=await this.usersRepository.getUserByUserId(fromUserId);
//             if(!isExistFromUser){
//                 console.log(isExistFromUser);
//                 return errResponse(baseResponse.FROM_USER_ID_NOT_FOUND);
//             }
//             console.log("toUserId= " + toUserId);
//             const isExistToUser=await this.usersRepository.getUserByUserId(toUserId);
//             if(!isExistToUser){
//                 console.log(isExistToUser);
//                 return errResponse(baseResponse.TO_USER_ID_NOT_FOUND);
//             }

//             const userBlock=new UserBlock(fromUserId,toUserId);
//             const isExist = await this.userBlockRepository.isExist(userBlock);
//             let foundEntity;
//             if(isExist.length==0){
//                 foundEntity=await this.userBlockRepository.postBlock(userBlock);
//                 return sucResponse(baseResponse.BLCOK);
//             }else{
//                 await this.userBlockRepository.deleteBlock(userBlock);
//                 return sucResponse(baseResponse.UN_BLCOK);
//             }
//         } catch (err) {
//             console.log(err);
//             return errResponse(baseResponse.DB_ERROR);
//         }
//     }
// }
