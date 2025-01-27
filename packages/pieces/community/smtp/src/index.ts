import { PieceAuth, Property, createPiece } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { sendEmail } from './lib/actions/send-email';
import { smtpCommon } from './lib/common';

const SMTPPorts = [25, 465, 587, 2525];

export const smtpAuth = PieceAuth.CustomAuth({
  required: true,
  props: {
    host: Property.ShortText({
      displayName: 'Host',
      required: true,
    }),
    email: Property.ShortText({
      displayName: 'Email',
      required: true,
    }),
    password: PieceAuth.SecretText({
      displayName: 'Password',
      required: true,
    }),
    port: Property.StaticDropdown({
      displayName: 'Port',
      required: true,
      options: {
        disabled: false,
        options: SMTPPorts.map((port) => {
          return {
            label: port.toString(),
            value: port,
          };
        }),
      },
    }),
    requireTLS: Property.Checkbox({
      displayName: 'Require TLS?',
      defaultValue: false,
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const transporter = smtpCommon.createSMTPTransport(auth);
      return new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            resolve({ valid: false, error: JSON.stringify(error) });
          } else {
            resolve({ valid: true });
          }
        });
      });
    } catch (e) {
      return {
        valid: false,
        error: JSON.stringify(e),
      };
    }
  },
});

export const smtp = createPiece({
  displayName: 'SMTP',
  minimumSupportedRelease: '0.5.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/smtp.png',
  categories: [PieceCategory.CORE],
  authors: ['abaza738', 'kishanprmr'],
  auth: smtpAuth,
  actions: [sendEmail],
  triggers: [],
});
