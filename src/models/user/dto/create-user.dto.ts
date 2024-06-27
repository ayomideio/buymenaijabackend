import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';

/** Describes the fields needed to create an User */
export class CreateUserDto implements User {
  /**
   * User email
   * @example "user@example.com"
   */
  @IsEmail({ message: 'Must be an e-mail' })
  email: string;

  /**
   * User password must contain at least 1 number and 1 letter
   * @example "abc123456"
   */
  @IsString()
  @MinLength(8, { message: 'Password must have length of at least 8' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 number and 1 letter',
  })
  password: string;

  /**
   * User name
   * @example "John Doe"
   */
  @IsOptional()
  @IsString()
  firstName?: string;


  /**
   * Last name
   * @example "John Doe"
   */
  @IsOptional()
  @IsString()
  lastName?: string;

  /**
   * PhoneNumber
   * @example "07045802442"
   */
  @IsString()
  phoneNumber: string;


    /**
   * User address
   * @example "World Street 0"
   */
    @IsString()
    @IsOptional()
    address?: string;


  /**
   * Business Name
   * @example "07045802442"
   */
  @IsOptional()
  @IsString()
  businessName?: string;

    /**
   * State
   * @example "kwara"
   */
    @IsOptional()
    @IsString()
    state?: string;

      /**
   * LGA
   * @example "lga"
   */
  @IsOptional()
  @IsString()
  lga?: string;

    /**
   * City
   * @example "Offa"
   */
    @IsOptional()
    @IsString()
    city?: string;

  /**
   * referralId
   * @example "034322"
   */
  @IsOptional()
  @IsString()
  referralId?: string;




}
