"use strict";
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event
      },
      null,
      2
    )
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.email = async event => {
  // create Nodemailer SES transporter
  const transporter = nodemailer.createTransport({
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "email failed to send"
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "mail sent"
    })
  };
};
