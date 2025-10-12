/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  authProvider?: UpdateUserDto.authProvider;
  role?: UpdateUserDto.role;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};
export namespace UpdateUserDto {
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
