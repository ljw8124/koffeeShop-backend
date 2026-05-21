import axios from 'axios';
import FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVariable, MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {

  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private sendEmail(subject: string, template: string, emailVariable: EmailVariable[]) {
    const formData = new FormData();
    formData.append('from', `KoffeeShop <postmaster@${this.options.domain}>`);
    formData.append('to', `ljw8124@gmail.com`);
    formData.append('subject', subject);
    formData.append('text', template);
    formData.append('template', "koffeeshop");
    emailVariable.forEach(eVar => formData.append(`v:${eVar.key}`, eVar.value));

    try {
      const response = axios({
        method: 'POST',
        headers: {
          "Authorization": `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
        },
        url: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        data: formData,
      });
    } catch(e) {
      console.error(e);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail("Verify Your Email", "verify-email", [
      {key: code, value: code},
      {key: 'username', value: email}
    ]);
  }

}
