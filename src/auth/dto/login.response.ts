/** Describes the response received when the Login route is successfully called */
export class LoginResponse {
  /**
   * Access JWT Authentication token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NWFkMzNhNS0wYjk4LTQ2ODYtYjFmMS1hMTkwNzM0NWJmYzciLCJpYXQiOjE2NDg0NzU3MzEsImV4cCI6MTY0ODQ3NjYzMX0.h3z3JDvHOi6y5C_N0Kt6tdP2nWK_dHBZxioQn7VANNo"
   */
  accessToken: string;

  /**
   * Refresh JWT Authentication token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  refreshToken: string;

  /**
   * User's ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  userId?: string;

  /**
   * User's email address
   * @example "user@example.com"
   */
  email?: string;

  /**
   * User's first name
   * @example "John"
   */
  firstName?: string;


    /**
   * User's last name
   * @example "Doe"
   */
    lastName?: string;


       /**
   * User's picture
   * @example "Doe"
   */
      avatar?: string;
  /**
   * Indicates if the user's email has been verified
   * @example true
   */
  emailVerified?: boolean;


  
  constructor(
    accessToken: string,
    refreshToken: string,
    userId: string,
    email: string,
    avatar:string,
    firstName: string,
    lastName: string,
    emailVerified: boolean,
   
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailVerified = emailVerified;
    
  }
}
