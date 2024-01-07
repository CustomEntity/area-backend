declare namespace Express {
  export interface User {
    jwt: any;
    google: any;
    gmail: any;
    github: any;
    spotify: any;
  }

  export interface Request {
    user: User;
  }
}
