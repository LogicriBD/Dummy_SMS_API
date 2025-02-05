export enum UserType {
  SYSTEM_ADMIN = 'System Admin',
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export const allUserTypes = Object.values(UserType);

export enum OTPTypes {
  EMAIL = 'email',
  PHONE = 'phone',
  FORGOT_PASSWORD = 'forgot-password',
}
