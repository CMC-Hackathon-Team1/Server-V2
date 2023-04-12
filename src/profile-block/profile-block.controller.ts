import { Body, Controller, Post, UseGuards, Request, Query ,  Get} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from '../auth/security/auth.guard.jwt';
import baseResponse from '../common/utils/baseResponseStatus';
import { BlockProfileRequestDTO } from './dto/BlockProfileRequestDTO';
import { ProfileBlockService } from './profile-block.service';

@ApiTags('Users')
@Controller('profile-block')
export class ProfileBlockController {
    constructor(private profileBlockService: ProfileBlockService) {}
    @ApiOperation({
    summary:
        '유저 차단 API',
    description:
        '둘러보기 탐색/팔로잉에서 사용되는 API이다. 둘러보기 게시물들 중에 마음에드는 프로필에 팔로우 설정/해제 할 수 있다.\n\
                        팔로우 상태에서는 팔로우가 해제 되고 팔로우를 안한 상태에서는 팔로우 상태가 된다.',
    })
    @ApiResponse({
        status: baseResponse.FROM_USER_ID_NOT_FOUND.statusCode,
        description: baseResponse.FROM_USER_ID_NOT_FOUND.message,
    })
    @ApiResponse({
        status: baseResponse.TO_USER_ID_NOT_FOUND.statusCode,
        description: baseResponse.TO_USER_ID_NOT_FOUND.message,
    })
    @ApiResponse({
        status: baseResponse.BLCOK.statusCode,
        description: baseResponse.BLCOK.message,
    })
    @ApiResponse({
        status: baseResponse.UN_BLCOK.statusCode,
        description: baseResponse.UN_BLCOK.message,
    })
    @ApiResponse({
    status: baseResponse.DB_ERROR.statusCode,
    description: baseResponse.DB_ERROR.message,
    })
    @ApiBearerAuth('Authorization')
    @UseGuards(JWTAuthGuard)
    @Post()
    async blockUser(@Body() blockProfileRequestDTO: BlockProfileRequestDTO,@Request() req: any) {
        const loginedUserId = req.user.userId;
        
        return this.profileBlockService.blockProfile(
            loginedUserId,
            blockProfileRequestDTO.fromProfileId,
            blockProfileRequestDTO.toProfileId,
            blockProfileRequestDTO.type
        );
    }

    @ApiOperation({
        summary:
            '유저 차단 목록 조회 API',
        description:
            '유저 차단 목록을 조회하는 API이다. 본인이 차단한 프로필이 대표로 목록에 나타난다.',
        })
        @ApiResponse({
        status: baseResponse.DB_ERROR.statusCode,
        description: baseResponse.DB_ERROR.message,
        })
        @ApiQuery({
            name: 'profileId',
            required: true,
            description: '로그인된 user의 profileId',
        })
        @ApiBearerAuth('Authorization')
        @UseGuards(JWTAuthGuard)
        @Get('/blocoked-profiles')
        async getBlockedProfiles(@Query('profileId') profileId: number,@Request() req: any) {
            const loginedUserId = req.user.userId;
            console.log(profileId);
            return this.profileBlockService.getBlockedProfiles(profileId);
        
        }
}

