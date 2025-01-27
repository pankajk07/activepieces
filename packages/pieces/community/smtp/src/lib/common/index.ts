import nodemailer from 'nodemailer';

export const smtpCommon = {
  constructConfig(auth: smtpAuthParams) {
    return {
      host: auth.host,
      port: auth.port,
      requireTLS: auth.requireTLS,
      auth: {
        user: auth.email,
        pass: auth.password,
      },
      connectionTimeout: 10000,
      secure: auth.port === 465,
    };
  },
  createSMTPTransport(auth: smtpAuthParams) {
    const smtpOptions = smtpCommon.constructConfig(auth);
    const transporter = nodemailer.createTransport(smtpOptions);
    return transporter;
  },
};

export type smtpAuthParams = {
  host: string;
  email: string;
  password: string;
  port: number;
  requireTLS: boolean;
};
