// var nodemailer = require('nodemailer');
// var config = require('../config/mailer');
//
// var transport = nodemailer.createTransport({
//   service:'MAILGUN',
//   auth:{
//     user:config.MAILGUN_USER,
//     pass:config.MAILGUN_PASS
//   },
//   tls:{
//     rejectUnauthorized:false
//   }
// });
// module.exports={
//   sendEMail(from,to,subject,html){
//     return new Promise(function(resolve,reject){
//       transport.sendMail({from,to,subject,html},function(err,info){
//         if(err) reject(err);
//         resolve(info);
//       });
//   });
// }
// }
