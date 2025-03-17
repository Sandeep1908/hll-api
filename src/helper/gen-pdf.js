import puppeteer from 'puppeteer';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { format } from 'date-fns';
import { errorLog, sesV2 } from '../utils/ses.js';
import supabaseAdmin from '../lib/supabase-admin';
import { getHTMLReportForOneBranch } from './templates';

const { Upload } = require('@aws-sdk/lib-storage');
// eslint-disable-next-line node/no-extraneous-require
const { S3Client } = require('@aws-sdk/client-s3');

const getBrowser = () => puppeteer.connect({  headless: true });


let browser = null;

// eslint-disable-next-line import/prefer-default-export
export async function genPDF(req, res) {
  try {
    const { branchId, fromDate, endDate  } = req.query
    if (!browser)
    browser = await getBrowser();
    const page = await browser.newPage();
    const start = fromDate ? new Date(fromDate):  new Date();
    start.setUTCHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate): new Date();
    end.setUTCHours(23, 59, 59, 999);

     const { data: branches } = await supabaseAdmin.from('branches').select('*').eq('id', branchId)
    // else
    //   supabaseAdmin.from('branches').select('*')
    //     .then(res => branches = res.data)
    // console.log({ branches });
    // eslint-disable-next-line no-restricted-syntax
    let todaysCounts
    for (const branch of branches) {
      // eslint-disable-next-line no-await-in-loop
      todaysCounts = await supabaseAdmin
        .from('daily_headcounts')
        .select('*')
        .gt('created_at', new Date(start).toISOString())
        .lt('created_at', new Date(end).toISOString())
        .eq('branch_id', branch?.id);
      branch.totalCount = todaysCounts?.data.length
        ? todaysCounts.data.reduce((acc, t) => acc + t.count, 0) : 0;
      branch.totalPurchased = todaysCounts?.data.length
        ? todaysCounts.data.reduce((acc, t) => (acc + t.is_purchased ? 1 : 0), 0) : 0;
      branch.totalNotPurchased = todaysCounts?.data.length - branch.totalPurchased
      const metals = ['gold', 'silver', 'diamond'];
      metals.forEach((metal) => {
        branch[metal] = todaysCounts?.data.length ? todaysCounts.data.reduce((acc, t) => acc + (t.is_purchased && t.metal_type === metal ? 1 : 0), 0) : 0;
      });
    }
    const theBranch = branches[0]
    // return res.send(getHTMLReportForOneBranch(theBranch.name,
    //     `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
    //     theBranch.totalCount,
    //     theBranch.totalPurchased,
    //     theBranch.totalNotPurchased,
    //     todaysCounts.data,
    //   ))
    await page.setContent(getHTMLReportForOneBranch(theBranch.name,
      `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      theBranch.totalCount,
      theBranch.totalPurchased,
      theBranch.totalNotPurchased,
      todaysCounts.data,
      ),
      {
      waitUntil: 'networkidle0',

    });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    const upload = await new Upload({
      client: new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_MAIN_KEY,
          secretAccessKey: process.env.AWS_MAIN_SECRET,
        },
        region: 'ap-south-1',
      }),
      params: {
        ACL: 'public-read',
        Bucket: 'duolearn-public',
        Key: `__v__/jaiguru/${Date.now().toString()}.pdf`,
        Body: pdf,
      },
      tags: [], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    }).done()
    res.send(upload.Location)

      // .catch((err) => {
      //   errorLog(`1: ${error.name} ${error.message}`);
      // })
      // .then((res) => {
      //   errorLog(`PDFUploaded`);
      //   sesV2.send(new SendEmailCommand({
      //
      //     Destination: {
      //       ToAddresses: ['devu.nm21@gmail.com', 'darshanjain45@gmail.com'],
      //     },
      //     Source: 'Jaiguru Jewellers <velozity-mailer-9467578375567@duolearn.tech>',
      //     Message: {
      //
      //       Body: {
      //
      //         Html: {
      //           Data: `
      //       Please download the report here: <a href="${res.Location}"> Download </a>
      //       `,
      //         },
      //       },
      //       Subject: {
      //         Data: `FrontDesk Report [${format(new Date(), 'dd/mm/yyyy')}]`,
      //       },
      //     },
      //   })).then(() => res.send('')).catch((err) => {
      //     errorLog(`2: ${err.name} ${err.message}`);
      //   });
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
  } catch (error) {
    await errorLog(`3: ${error.name} ${error.message}`);

    console.log(error);
    // if (!res.headersSent) {
    //   res.status(400).send(error.message);
    // }
  }
}
