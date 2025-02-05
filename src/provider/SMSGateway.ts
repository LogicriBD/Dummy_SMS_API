import axios from 'axios';
import { log, toFlattenedString } from '../utils/Helper';
import { SendSMSPayload } from '../types/SMS';

class SMSGatewayImpl {
  public static instance: SMSGatewayImpl;
  private gatewayEnabled: boolean;
  private staticKey: string;
  private userName: string;
  private password: string;
  private masking: string;

  private constructor() {
    this.gatewayEnabled = this.isProductionEnvironment();
    this.staticKey = process.env.SMS_STATIC_KEY!;
    this.userName = process.env.SMS_USER_NAME!;
    this.password = process.env.SMS_PASSWORD!;
    this.masking = process.env.SMS_MASKING!;
  }

  isProductionEnvironment() {
    return process.env.NODE_ENV === 'prod';
  }

  getResizedPhoneNumber = (phone: string) => {
    try {
      const meaningfulPart = `${phone}`.slice(-10);
      const fullForm = '+880' + meaningfulPart;
      return fullForm.slice(-11);
    } catch (err) {
      console.log(`error in phone number resize: ${phone}`);
      return '';
    }
  };

  public static getInstance(): SMSGatewayImpl {
    if (!SMSGatewayImpl.instance) {
      SMSGatewayImpl.instance = new SMSGatewayImpl();
    }

    return SMSGatewayImpl.instance;
  }

  async sendSMS({ phone, text }: SendSMSPayload) {
    try {
      const sms = {
        verified: false,
        enabled: this.gatewayEnabled,
        text,
        staticKey: this.staticKey,
      };
      if (process.env.NODE_ENV !== 'production') {
        log('info', `DEBUG ENV:: SMS send response for phone: ${phone}\t` + text);
        return {
          message: 'SMS sent successfully in debug mode',
          ...sms,
        };
      }

      const res = await axios.get(process.env.SMS_ENDPOINT!, {
        params: {
          receiver: this.getResizedPhoneNumber(phone),
          userName: this.userName,
          password: this.password,
          masking: this.masking,
          MsgType: 'TEXT',
          message: text,
        },
      });
      log('info', 'SMS send response:: ' + toFlattenedString(res.data));
      return {
        message: 'SMS sent successfully',
        ...sms,
        ...res.data,
      };
    } catch (error) {
      log('error', 'SMS send error:: ', error);
      return false;
    }
  }
}

export const SMSGateway = SMSGatewayImpl.getInstance();
