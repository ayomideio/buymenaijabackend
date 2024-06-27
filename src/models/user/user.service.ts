import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { hashConfig } from 'src/config/hash.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserWithoutPassword } from './entities/user-without-password.entity';
import { User } from './entities/user.entity';
import { InvalidPasswordUpdateException } from './exceptions/invalid-password-update.exception';
import { MissingPasswordUpdateException } from './exceptions/missing-password-update.exception';
import * as nodemailer from 'nodemailer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';

/**
 * Responsible for managing users in the database.
 * CRUD endpoints are available for users.
 */
@Injectable()
export class UserService {
  /**
   * Instantiate the class and the PrismaService dependency
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sends an OTP email to the user
   * @param email - The email address of the user
   * @param otp - The OTP code to send
   */
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email.');
    }
  }


    /**
   * Sends an email to the agent
   * @param email - The email address of the user
   * @param otp - The OTP code to send
   */
    private async sendWelcomeEmail(email: string, otp: string): Promise<void> {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to buymenaija',
        text: `Your login details are
        email  ${email}
        password abc123456.
        Login now to change your password
        `,
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email.');
      }
    }


        /**
   * Sends an email to the agent
   * @param email - The email address of the user
   * @param otp - The OTP code to send
   */
        private async sendWelcomeEmailSign(email: string, otp: string): Promise<void> {
          const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email provider
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to buymenaija',
            text: `Your otp is ${otp}
            `,
          };
      
          try {
            await transporter.sendMail(mailOptions);
          } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send OTP email.');
          }
        }

    /**
   * Sends an email to the agent
   * @param email - The email address of the user
   * @param otp - The OTP code to send
   */
    private async sendAgentUserWelcomeEmail(email: string, otp: string,password:string): Promise<void> {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to buymenaija',
        text: `Your login details are
        email  ${email}
        password ${password}.
     
        `,
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email.');
      }
    }

  /**
   * Creates a new user
   * @param createUserDto - The data transfer object containing user creation data
   */
  async create(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await hash(createUserDto.password, hashConfig.saltRounds);
    const lowerCaseEmail = createUserDto.email.toLowerCase();
    var otp = Math.floor(100000 + Math.random() * 900000).toString();
    var otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    await this.prisma.user.create({
      data: {
        ...createUserDto,
        email: lowerCaseEmail,
        password: hashedPassword,

        otp:otp,
        
        otpExpiresAt: otpExpiresAt,
      },
    });

   
    await this.sendOtpEmail(createUserDto.email, otp);
  }

    /**
   * Creates a new agent
   * @param createUserDto - The data transfer object containing agents creation data
   */
    async createAgent(createUserDto: CreateUserDto): Promise<void> {
      const hashedPassword = await hash(createUserDto.password, hashConfig.saltRounds);
      const lowerCaseEmail = createUserDto.email.toLowerCase();
      var otp = Math.floor(100000 + Math.random() * 900000).toString();
      var otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
      await this.prisma.user.create({
        data: {
          ...createUserDto,
          email: lowerCaseEmail,
          password: hashedPassword,
          referralId:uuid(),
  
          otp:otp,
          
          otpExpiresAt: otpExpiresAt,
          role:Role.AGENT
        },
      });
  
     
      await this.sendWelcomeEmailSign(createUserDto.email, otp);
    }

       /**
   * Creates a new seller under an agent
   * @param createUserDto - The data transfer object containing agents creation data
   */
       async  createAgentSeller(createUserDto: CreateUserDto,userId:string): Promise<void> {
        const hashedPassword = await hash(createUserDto.password, hashConfig.saltRounds);
        const lowerCaseEmail = createUserDto.email.toLowerCase();
        var otp = Math.floor(100000 + Math.random() * 900000).toString();
        var otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
        const agnt=await this.prisma.user.findUnique(
          {
            where:{
              id:userId
            }
          }
        )
        await this.prisma.user.create({
          data: {
            ...createUserDto,
            email: lowerCaseEmail,
            password: hashedPassword,
    
            otp:otp,
            referralId:agnt.referralId,
            
            
            otpExpiresAt: otpExpiresAt,
            role:Role.SELLER
          },
        });
    
       
        await this.sendAgentUserWelcomeEmail(createUserDto.email, otp,createUserDto.password);
      }

  
// 673046
// 2024-06-09T21:48:28.878Z
  async validateOtp(email: string, otp: string): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: { otp: true, otpExpiresAt: true, id: true, isVerified: true },
      });
  
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
  
      console.log(`otp ==== ${otp}`);
      console.log(`user otp ==== ${JSON.stringify(user)}`);
  
      if (user.otp !== otp) {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
  
      if (user.otpExpiresAt < new Date()) {
        throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
      }
  
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otp: null,
          otpExpiresAt: null,
        },
      });
  
      return { message: 'OTP validated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  
  /**
   * Finds user by id and returns the user without password.
   * Used for default in-app requests where the hashed password won't be compared
   * @param id - The user id
   */
  async findById(id: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }



      /**
   * Finds user by agent and returns the user without password.
   * Used for default in-app requests where the hashed password won't be compared
   * @param id - referral id
   */
      async userAgentData(id: string) {
        const user = await this.prisma.user.findUnique({
          where:{
            id:id
          }
        })
    
        return await this.prisma.user.findMany({
          where:{
            referralId:user.referralId,
            role:Role.SELLER
          }
  
        });
      }


    /**
   * Finds user by agent and returns the user without password.
   * Used for default in-app requests where the hashed password won't be compared
   * @param id - referral id
   */
    async findByAgent(id: string) {
      const user = await this.prisma.user.findUnique({
        where:{
          id:id
        }
      })
  
      return await this.prisma.user.findMany({
        where:{
          referralId:user.referralId,
          role:Role.SELLER
        }

      });
    }


  /**
   * Finds user by agent and returns the user without password.
   * Used for default in-app requests where the hashed password won't be compared
   * @param id - referral id
   */
  async findAgentDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where:{
        id:id
      }
    })

    return await this.prisma.user.findMany({
      where:{
        referralId:user.referralId
      }

    });
  }





  /**
   * Gets all  buyers details
   * Used for default in-app requests where the hashed password won't be compared
   */
  async AdminDash() {
    const buyer = await this.prisma.user.findMany({
      where:{
        role:Role.USER
      }
    });
    const seller = await this.prisma.user.findMany({
      where:{
        role:Role.SELLER
      }
    });
    const agent = await this.prisma.user.findMany({
      where:{
        role:Role.AGENT
      }
    });
    const subscription=await this.prisma.subscription.findMany();



    return {
      buyers:buyer,
      sellers:seller,
      agents:agent,
      subscribers:subscription
    }
  


    // return user;
  }


  /**
   * Finds user by email and returns the user with password.
   * Used mainly in login to compare if the inputted password matches the hashed one.
   * @param email - The user's email
   */
  async findByEmail(email: string): Promise<User> {
    const lowerCaseEmail = email.toLowerCase();
    return this.prisma.user.findUnique({ where: { email: lowerCaseEmail } });
  }

  /**
   * Updates user information
   * @param id - The user id
   * @param updateUserDto - The data transfer object containing user update data
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    await this.hashIfUpdatingPassword(id, updateUserDto);

    const user = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, updatedAt: new Date() },
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   * Updates user role
   * @param updateUserRoleDto - The data transfer object containing user role update data
   */
  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.update({
      where: { email: updateUserRoleDto.email },
      data: { role: updateUserRoleDto.role },
    });

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   * Removes user from the database
   * @param id - The user id
   * @param deleteUserDto - The data transfer object containing user deletion data
   */
  async remove(id: string, deleteUserDto: DeleteUserDto): Promise<void> {
    await this.validateCurrentPassword(id, deleteUserDto.currentPassword);
    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * If the user inputted both new password and current password,
   * the new password is hashed to be saved in the database replacing the current one.
   * If only the new password or current password were inputted, an error is thrown.
   * @param id - The user id
   * @param updateUserDto - The data transfer object containing user update data
   */
  private async hashIfUpdatingPassword(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    if (updateUserDto.password && updateUserDto.currentPassword) {
      await this.validateCurrentPassword(id, updateUserDto.currentPassword);

      const hashedPassword = await hash(updateUserDto.password, hashConfig.saltRounds);

      updateUserDto.password = hashedPassword;
      delete updateUserDto.currentPassword;
    } else if (updateUserDto.password || updateUserDto.currentPassword) {
      throw new MissingPasswordUpdateException();
    }
  }

  /**
   * Compares if the inputted current password matches the user's hashed password saved in the database.
   * If it doesn't, an error is thrown.
   * @param id - The user id
   * @param currentPassword - The current password inputted by the user
   */
  private async validateCurrentPassword(id: string, currentPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    const isCorrectPassword = await compare(currentPassword, user.password);

    if (!isCorrectPassword) {
      throw new InvalidPasswordUpdateException();
    }
  }
}
