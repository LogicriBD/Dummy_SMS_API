import { EmailMessage } from './Email'

export interface EmailProvider {
  sendEmail(email: EmailMessage): Promise<any>
}
