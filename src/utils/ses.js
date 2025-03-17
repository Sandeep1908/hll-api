import { format } from 'date-fns';

// eslint-disable-next-line import/no-extraneous-dependencies
 
import aws from 'aws-sdk'
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const s3Bucket = process.env.UPLOAD_BUCKET;

const s3Region = 'ap-south-1';
export const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: s3Region,
  accessKeyId: process.env.UPLOAD_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.UPLOAD_AWS_SECRET_ACCESS_KEY,
});

export const ses = new aws.SES({
  signatureVersion: 'v4',
  region: s3Region,
  accessKeyId: process.env.AWS_MAIN_KEY,
  secretAccessKey: process.env.AWS_MAIN_SECRET,
});

export const sesV2 = new SESClient({
  region: s3Region,
  credentials: {
    accessKeyId: process.env.AWS_MAIN_KEY,
    secretAccessKey: process.env.AWS_MAIN_SECRET,
  },
});
export const uploadToS3PM = (path, filename, buffer, ext) => new Promise((resolve, reject) => {
  s3.upload({
    Key: `${path}/${filename}.${ext}`,
    Body: buffer,
    Bucket: s3Bucket,
  }, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

export const errorLog = (body) => sesV2.send(new SendEmailCommand({

  Destination: {
    ToAddresses: ['devu.nm21@gmail.com'],
  },
  Source: 'Jaiguru Vercel Functions Log <velozity-mailer-9467578375567@duolearn.tech>',
  Message: {

    Body: {

      Html: {
        Data: body,
      },
    },
    Subject: {
      Data: `[${format(new Date(), 'dd/mm/yyyy hh:mm:ss')}]`,
    },
  },
}));


export const sendEmailFromEkademy = (email, subject, body) => sesV2.send(new SendEmailCommand({

  Destination: {
    ToAddresses: [email],
  },
  Source: 'Ekademy <ekademy-mailer-9467578375567@mailing.ekademy.net>',
  Message: {
    Body: {
      Html: {
        Data: body,
      },
    },
    Subject: {
      Data: subject,
    },
  },
}));
