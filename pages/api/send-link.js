// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'test@example.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

import { sendGridAdmin } from '/lib/sendGridAdmin';

// const msg = {
//   to: 'test@example.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { to, from, subject, text, html } = req.body;

      if (!to || !to.includes('@')) {
        return res.status(400).json({ error: 'Invalid recipient email address' });
      }
      if (!from.email || !from.email.includes('@')) {
        return res.status(400).json({ error: 'Invalid sender email address' });
      }
      if (!from.name) {
        return res.status(400).json({ error: 'Missing sender name' });
      }
      if (!subject) {
        return res.status(400).json({ error: 'Missing email subject' });
      }
      if (!text) {
        return res.status(400).json({ error: 'Missing email text' });
      }
      if (!html) {
        return res.status(400).json({ error: 'Missing email html' });
      }

      // Use await instead of .then()
      await sendGridAdmin.send(req.body);
      return res.status(200).json({ message: 'Email sent' });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}