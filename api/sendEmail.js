"use strict";
const nodemailer = require("nodemailer");
const BASE_REDIRECT_URL = "http://localhost:8081/admin/resetpasswordpage";

const ProtonMail = require('protonmail-api');

async function sendEmail(receiver, generatedLink) {
  console.log(generatedLink);
  const urlString = BASE_REDIRECT_URL + '/' + generatedLink + '"';
  var firstHtmlPart = '<!doctype html><html lang="en-US"><head>    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />    <title>Reset Password Email Template</title>    <meta name="description" content="Reset Password Email Template.">    <style type="text/css">        a:hover {text-decoration: underline !important;}    </style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">    <!--100% body table-->    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: \'Open Sans\', sans-serif;">        <tr>            <td>                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"                    align="center" cellpadding="0" cellspacing="0">                    <tr>                        <td style="height:80px;"> </td>                    </tr>                    <tr>                        <td style="text-align:center;">                          <a href="https://rakeshmandal.com" title="logo" target="_blank">                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">                          </a>                        </td>                    </tr>                    <tr>                        <td style="height:20px;"> </td>                    </tr>                    <tr>                        <td>                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">                                <tr>                                    <td style="height:40px;"> </td>                                </tr>                                <tr>                                    <td style="padding:0 35px;">                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:\'Rubik\',sans-serif;">You have                                            requested to reset your password</h1>                                        <span                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">                                            We cannot simply send you your old password. A unique link to reset your                                            password has been generated for you. To reset your password, click the                                            following link and follow the instructions.                                        </p>                                        <a href="';
  var secondHtmlPart = '              style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset                                            Password</a>                                    </td>                                </tr>                                <tr>                                    <td style="height:40px;"> </td>                                </tr>                            </table>                        </td>                    <tr>                        <td style="height:20px;"> </td>                    </tr>                    <tr>                        <td style="text-align:center;">                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">© <strong>www.tomi-nebunu.com</strong></p>                        </td>                    </tr>                    <tr>                        <td style="height:80px;"> </td>                    </tr>                </table>            </td>        </tr>    </table>    <!--/100% body table--></body></html>';
  console.log(urlString);
  var html = firstHtmlPart + urlString + secondHtmlPart;

  console.log(html);
   // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    port: 465,
    host: 'mail.protonmail.com',
    secure: false, // true for 465, false for other ports
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: 'myDocsOnline@protonmail.com', // generated ethereal user
      pass: 'Student375202#'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"MY DOCS ONLINE" <myDocsOnline@protonmail.com>', // sender address
      to: receiver, // list of receivers
      subject: 'FORGOT PASSWORD', // Subject line
      text: 'Hello world?', // plain text body
      html: html // html body
  };

  // send mail with defined transport object
  /*
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  */

  try {
    const pm = await ProtonMail.connect({
      username: 'myDocsOnline@protonmail.com',
      password: 'Student375202#'
    });
    try {
      await pm.sendEmail({
        to: receiver,
        subject: 'Send email tutorial',
        body: html
      })
      console.log("it works");
      pm.close()
      return true;
    } catch (err) {
      console.log("doesnt work");
      return false;
    }
  } catch (err) {
    console.log("doesnt work");
    return false;
  }

};
// sendEmail is defined inside the module so we can call it wherever we want

// sendEmail().catch(console.error);

// Export it to make it available outside
module.exports.sendEmail = sendEmail;