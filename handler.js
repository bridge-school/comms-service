"use strict";
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const { WebClient } = require("@slack/client");

module.exports.slackNewApplication = async event => {
  const token = process.env.SLACK_TOKEN;
  const web = new WebClient(token);
  try {
    await web.chat.postMessage({
      channel: "application-notis",
      attachments: [
        {
          text: "New application from me!",
          footer: "New application for cohort 10033"
        }
      ]
    });
    return {
      statusCode: 200
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message
      })
    };
  }
};

module.exports.email = async event => {
  const testAccount = await nodemailer.createTestAccount();
  // create Nodemailer SES transporter
  const transporter =
    process.env.NODE_ENV === "development"
      ? nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
          }
        })
      : nodemailer.createTransport({
          SES: new aws.SES({
            apiVersion: "2010-12-01"
          })
        });

  const { email, firstName, lastName } = JSON.parse(event.body);

  // send some mail
  try {
    await transporter.sendMail({
      from: "purvi@bridgeschool.io", // account to send from, verified through SES
      to: email, // account to send to
      subject: `Thanks for applying ${firstName}!`,
      text: `Thank you for applying to Bridge, ${firstName}. We'll be in touch shortly!`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "mail sent"
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "email failed to send"
      })
    };
  }
};
