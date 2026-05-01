import axios from 'axios';
import FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { MailModuleOptions } from './mail.interfaces';

@Injectable()
export class MailService {

  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log('sendEmail?');
    this.sendEmail('testing', 'test')
  }

  private sendEmail(subject: string, content: string) {
    const formData = new FormData();
    formData.append('from', `Mailgun Sandbox <postmaster@${this.options.domain}>`);
    formData.append('to', `ljw8124@gmail.com`);
    formData.append('subject', subject);
    formData.append('text', content);

    const response = axios({
      method: 'POST',
      headers: {
        "Authorization": `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
      },
      url: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      data: formData,
    });

    console.log(response);

  }

}
