const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not configured or invalid. Email functionality will be disabled.');
}

const sendEmail = async (options) => {
 console.log(options)
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    console.log('Email would be sent:', {
      to: options.email,
      subject: options.subject,
      message: options.message
    });
    return;
  }

  const msg = {
    to: options.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: options.subject,
    text: options.message,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Email could not be sent.');
  }
};

module.exports = sendEmail;