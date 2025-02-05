export enum TokenType {
  ACCESS = 'Access',
  REFRESH = 'Refresh',
  RESET_PASSWORD = 'Reset Password',
  RESET_LINK = 'Reset Link',
  VERIFY_EMAIL = 'Verify Email',
}

export const allTokenTypes = Object.values(TokenType);
