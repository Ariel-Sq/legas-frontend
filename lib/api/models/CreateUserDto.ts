/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  authProvider?: CreateUserDto.authProvider;
  role?: CreateUserDto.role;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};
export namespace CreateUserDto {
  export enum authProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    INSTAGRAM = 'instagram',
    APPLE = 'apple',
  }
  export enum role {
    OWNER = 'owner',
    ADMIN = 'admin',
    CUSTOMER = 'customer',
  }
}
