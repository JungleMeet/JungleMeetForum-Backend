const nodemailer = require('nodemailer');
const { StatusCodes } = require('http-status-codes');
const Email = require('../models/Email');
const User = require('../models/User');
const generateUniqueString = require('./generateUniqueString');

// eslint consistent-return: "error"
const sendEmail = async (req, res) => {
  const { to } = req.body;
  const from = '"Rachel" <yanhanfang828@gmail.com>';
  const subject = 'Reset password';
  // const httpTransport = 'http://';
  const baseUrl = req.headers.origin;
  console.log('baseUrl', baseUrl);
  const message = 'Please click the link to reset your new password:';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yanhanfang828@gmail.com',
      pass: 'cahwefatsyefeqny',
    },
  });

  try {
    const user = await User.findOne({ email: to });
    // console.log(user);
    if (user) {
      const code = generateUniqueString(10);
      const email = new Email({ email: to, code });
      const ret = await email.save();
      console.log(ret);
      const mailOptions = {
        from, // sender address
        to, // list of receivers
        subject, // Subject line
        text: message, // plain text body
        html: `<p>Please click the link to reset your new password:<a href='${baseUrl}/resetPassword?code=${code}'>${baseUrl}/resetPassword/</a></p>
                <p>Please note that this link will expire within 1 hour</p>`, // html body
      };
      console.log(mailOptions);
      await transporter.sendMail(mailOptions);
      return res.status(StatusCodes.OK).json({ message: 'Email Sent!' });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Email not exist' });
  } catch (err) {
    return res.status(StatusCodes.NOT_FUND).json(err);
  }
};

module.exports = sendEmail;
