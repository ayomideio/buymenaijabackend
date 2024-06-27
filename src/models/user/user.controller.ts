import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request,Response } from 'express';
import { Public } from 'src/auth/public.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassword } from './entities/user-without-password.entity';
import { UserService } from './user.service';
import { VerifyUserOtpDto } from './dto/verify-user-otp.dto';
import { FileUpload } from 'src/common/decorators/file-upload.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { S3Upload } from 'src/util/s3-uploader';
import { PrismaService } from 'src/prisma/prisma.service';


/** Exposes user CRUD endpoints */
@ApiTags('user')
@Controller('user')
export class UserController {
  /** Exposes user CRUD endpoints
   *
   * Instantiate class and UserService dependency
   */
  constructor(private readonly userService: UserService,

    private readonly prismaService:PrismaService
    

  ) {}



  /** Creates a new user */
  @ApiOperation({ summary: 'Creates a new user' })
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.userService.create(createUserDto);
  }

    /** Creates a new user */
    @ApiOperation({ summary: 'Creates a new Agent' })
    @Public()
    @Post('/agent')
    createAge(@Body() createUserDto: CreateUserDto): Promise<void> {
      return this.userService.createAgent(createUserDto);
    }
  


   /** Endpoint to upload a file and return its URL */
   @ApiOperation({ summary: 'Uploads a file and returns its URL' })  // You can make this endpoint public if needed
   @Post('uploadimage')
   @UseInterceptors(FileInterceptor('file', {
     storage: multer.memoryStorage()
   }))
   @ApiConsumes('multipart/form-data')
   @ApiBearerAuth()
   @ApiBody({
     schema: {
       type: 'object',
       properties: {
         file: {
           type: 'string',
           format: 'binary'
         }
       }
     }
   })
   async uploadFile(@UploadedFile() file: Express.Multer.File
 
 ,
 @Req() request: Request
 ): Promise<{ fileUrl: string }> {
  const userId = request.user['userId'];
     console.log(`file ${JSON.stringify(file.buffer)}`);
     const s3Upload=new S3Upload()
     const uploadResult = await s3Upload.uploadFile(file.buffer, file.originalname);

  await this.prismaService.user.update({
    where:{
      id:userId
    },
    data:{
      avatar:uploadResult.fileUrl
    }
  })
     return { fileUrl: uploadResult.fileUrl };
   }
  /** Creates a new user */
  @ApiOperation({ summary: 'Creates a new Agent' })
  @IsAdmin()
  @Post('/agent')
  createAgent(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.userService.createAgent(createUserDto);
  }


    /** Creates seller by agent */
    @ApiOperation({ summary: 'Creates a new Agent' })
    @ApiBearerAuth()
    @Post('/agentseller')
    createSellerAgent(@Req() request: Request,@Body() createUserDto: CreateUserDto): Promise<void> {
      const userId = request.user['userId'];
      return this.userService.createAgentSeller(createUserDto,userId);
    }
  /** Validate OTP */
  @ApiOperation({ summary: 'Validates OTP' })
  @Public()
  @Post('/validateotp')
  async verifyOtp(@Body() verifyUserOtp: VerifyUserOtpDto, @Res() res: Response): Promise<void> {
    try {
      const response = await this.userService.validateOtp(verifyUserOtp.email, verifyUserOtp.otp);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }
  /** Returns user's own profile information without password */
  @ApiOperation({ summary: "Gets user's own profile" })
  @ApiBearerAuth()
  @Get()
  async findById(@Req() request: Request): Promise<UserWithoutPassword> {
    const userId = request.user['userId'];

    return this.userService.findById(userId);
  }



     /** Returns buyer's  profile information without password */
     @ApiOperation({ summary: "Gets uagents data" })
     @ApiBearerAuth()
     @Get('/agentdata:id')
     async userAgentData(@Req() request: Request,
     @Param('id') id: string
    ){

       const userId = request.user['userId'];
   
       return this.userService.userAgentData(id);
     }


   /** Returns buyer's  profile information without password */
   @ApiOperation({ summary: "Gets user's own profile" })
   @ApiBearerAuth()
   @Get('/agent')
   async userByAgent(@Req() request: Request){
     const userId = request.user['userId'];
 
     return this.userService.findByAgent(userId);
   }

   /** Returns buyer's  profile information without password */
   @ApiOperation({ summary: "Gets user's own profile" })
   @IsAdmin()
   @Get('/admindash')
   async adminDashboard(@Req() request: Request){
     const userId = request.user['userId'];
 
     return this.userService.AdminDash();
   }

  /** Updates user information */
  @ApiOperation({ summary: 'Updates user' })
  @ApiBearerAuth()
  @Patch()
  update(
    @Req() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const userId = request.user['userId'];

    return this.userService.update(userId, updateUserDto);
  }

  /** Updates user role, only for admins */
  @ApiOperation({ summary: "Admin set user's role" })
  @IsAdmin()
  @Patch('role')
  updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserWithoutPassword> {
    return this.userService.updateUserRole(updateUserRoleDto);
  }

  /** Deletes user and all user related information from the system */
  @ApiOperation({ summary: 'Deletes user' })
  @ApiBearerAuth()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() request: Request,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<void> {
    const userId = request.user['userId'];

    return this.userService.remove(userId, deleteUserDto);
  }
}
