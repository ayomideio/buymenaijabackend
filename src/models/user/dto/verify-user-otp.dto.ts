import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  import { User } from '../entities/user.entity';
  
  /** Describes the fields needed to create an User */
  export class VerifyUserOtpDto {



  /**
   * User email
   * @example "user@example.com"
   */
  @IsEmail({ message: 'Must be an e-mail' })
  email: string;



    /**
     * OTP
     * @example "123456"
     */

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must have length of at least 8' })
  
  otp: string;
  
  }  