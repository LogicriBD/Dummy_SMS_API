export interface EmailMessage {
  getRecipients: () => string
  getSubject: () => string
  getMessage: () => string
}
