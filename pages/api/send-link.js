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
import mjml2html from 'mjml'

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
      const { data, to, from, subject, text, html } = req.body;

      if (!to || !to.includes('@')) {
        return res.status(400).json({ error: 'Invalid recipient email address' });
      }
      // if (!from.email || !from.email.includes('@')) {
      //   return res.status(400).json({ error: 'Invalid sender email address' });
      // }
      // if (!from.name) {
      //   return res.status(400).json({ error: 'Missing sender name' });
      // }
      // if (!subject) {
      //   return res.status(400).json({ error: 'Missing email subject' });
      // }
      // if (!text) {
      //   return res.status(400).json({ error: 'Missing email text' });
      // }
      // if (!html) {
      //   return res.status(400).json({ error: 'Missing email html' });
      // }

      // const htmlOutput = mjml2html(`
      //   <mjml>
      //     <mj-body>
      //       <mj-section>
      //         <mj-column>
      //           <mj-text>
      //             Try this login link:
      //             <mj-button href=${data.link} align="center">
      //               Login to my account
      //             </mj-button>
      //           </mj-text>
      //         </mj-column>
      //       </mj-section>
      //     </mj-body>
      //   </mjml>
      // `)

      // card style:
      // const htmlOutput = mjml2html(`
      //   <mjml>
      //     <mj-head>
      //       <mj-title>Here’s your magic sign in link</mj-title>
      //       <mj-preview>Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</mj-preview>
      //       <mj-attributes>
      //         <mj-all font-family="'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
      //         <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
      //       </mj-attributes>
      //       <mj-style inline="inline">
      //         .footer-link {
      //         color: #15121C;
      //         text-decoration: none;
      //         }
      //       </mj-style>
      //     </mj-head>
      //     <mj-body background-color="#FAFAF9" width="600px">
      //       <mj-wrapper padding-top="48px" padding-bottom="48px" padding-left="16px" padding-right="16px">
      //         <mj-section background-color="#ffffff" border-radius="48px" padding="48px">
      //           <mj-column width="100%">
      //             <mj-text color="#15121C" font-weight="Thin" font-size="34px" line-height="38px" font-family="'Marcellus', Georgia, Times New Roman, serif" padding-left="0" padding-right="0">
      //               Here’s your magic sign in link
      //             </mj-text>
      //             <mj-text color="#8F8D92" font-size="16px" padding-bottom="30px" padding-left="0" padding-right="0">
      //               Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.
      //             </mj-text>
      //             <mj-button href=${data.link} align="left" background-color="#15121C" color="#ffffff" font-size="20px" font-weight="400" border-radius="100px" inner-padding="17px 24px" padding="0">
      //               Log in to my account
      //             </mj-button>
      //           </mj-column>
      //         </mj-section>
      //         <mj-section>
      //           <mj-column width="100%" padding="0">
      //             <mj-text color="#8F8D92" font-size="14px" align="left" line-height="14px" padding-left="0" padding-right="0">
      //               With ❤️ from <a class="footer-link" href="https://www.epicbabynames.com">EpicBabyNames.com</a>
      //             </mj-text>
      //           </mj-column>
      //         </mj-section>
      //       </mj-wrapper>
      //     </mj-body>
      //   </mjml>
      // `)

      // blank style:
      const htmlOutput = mjml2html(`
        <mjml>
          <mj-head>
            <mj-title>Here’s your magic sign in link</mj-title>
            <mj-preview>Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</mj-preview>
            <mj-attributes>
              <mj-all font-family="'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
              <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
            </mj-attributes>
            <mj-style inline="inline">
              .footer-link {
              color: #15121C;
              text-decoration: none;
              }
            </mj-style>
          </mj-head>
          <mj-body background-color="#FFFFFF" width="600px">
            <mj-wrapper padding-top="48px" padding-bottom="48px" padding-left="32px" padding-right="32px">
              <mj-section>
                <mj-column width="100%">
                  <mj-text color="#15121C" font-weight="Thin" font-size="34px" line-height="38px" font-family="'Marcellus', Georgia, Times New Roman, serif" padding-left="0" padding-right="0">
                    Here’s your magic sign in link
                  </mj-text>
                  <mj-text color="#8F8D92" font-size="16px" padding-bottom="30px" padding-left="0" padding-right="0">
                    Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.
                  </mj-text>
                  <mj-button href=${data.link} align="left" background-color="#15121C" color="#ffffff" font-size="20px" font-weight="400" border-radius="100px" inner-padding="17px 24px" padding="0">
                    Log in to my account
                  </mj-button>
                </mj-column>
              </mj-section>
              <mj-section>
                <mj-column width="100%" padding="0">
                  <mj-text color="#8F8D92" font-size="14px" align="left" line-height="14px" padding-left="0" padding-right="0">
                    With ❤️ from <a class="footer-link" href="https://www.epicbabynames.com">EpicBabyNames.com</a>
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-wrapper>
          </mj-body>
        </mjml>
      `)

      const msg = {
        to: to, // Change to your recipient
        from: {
          email: 'team@epicbabynames.com',
          name: 'Epic Baby Names'
        },
        subject: 'Here’s your magic sign in link',
        text: 'Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.',
        // html: `<strong>and easy to do anywhere, even with Node.js. Here's even a <a href=${data.link}>sign in link</a></strong>`
        // html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>Here’s your magic sign in link</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; } body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; } table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; } img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; } p { display:block;margin:13px 0; }</style><!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]--><!--[if lte mso 11]><style type="text/css"> .mj-outlook-group-fix { width:100% !important; } </style><![endif]--><style type="text/css">@media only screen and (min-width:480px) { .mj-column-per-100 { width:100% !important; max-width: 100%; }}</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css"></style></head><body style="word-spacing:normal;background-color:#FAFAF9;"><div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</div><div style="background-color:#FAFAF9;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:48px;padding-left:16px;padding-right:16px;padding-top:48px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:568px;" width="568" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:48px;max-width:568px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:48px;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:48px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:472px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-left:0;word-break:break-word;"><div style="font-family:'Marcellus', Georgia, Times New Roman, serif;font-size:34px;font-weight:Thin;line-height:38px;text-align:left;color:#15121C;">Here’s your magic sign in link</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-bottom:30px;padding-left:0;word-break:break-word;"><div style="font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#8F8D92;">Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</div></td></tr><tr><td align="left" vertical-align="middle" style="font-size:0px;padding:0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#15121C" role="presentation" style="border:none;border-radius:100px;cursor:auto;mso-padding-alt:17px 24px;background:#15121C;" valign="middle"><a href="${data.link}" style="display:inline-block;background:#15121C;color:#ffffff;font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:400;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:17px 24px;mso-padding-alt:0px;border-radius:100px;" target="_blank">Log in to my account</a></td></tr></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:568px;" width="568" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:568px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:568px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-left:0;word-break:break-word;"><div style="font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:14px;text-align:left;color:#8F8D92;">With ❤️ from <a class="footer-link" href="https://www.epicbabynames.com" style="color: #15121C; text-decoration: none;">EpicBabyNames.com</a></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>`
        // html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title>Here's your magic sign in link</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; } body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; } table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; } img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; } p { display:block;margin:13px 0; }</style><!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]--><!--[if lte mso 11]><style type="text/css">.mj-outlook-group-fix { width:100% !important; }</style><![endif]--><style type="text/css">@media only screen and (min-width:480px) { .mj-column-per-100 { width:100% !important; max-width: 100%; }}</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css"></style></head><body style="word-spacing:normal;background-color:#FFFFFF;"><div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</div><div style="background-color:#FFFFFF;"><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:48px;padding-left:32px;padding-right:32px;padding-top:48px;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:536px;" width="536" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:536px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:536px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-left:0;word-break:break-word;"><div style="font-family:'Marcellus', Georgia, Times New Roman, serif;font-size:34px;font-weight:Thin;line-height:38px;text-align:left;color:#15121C;">Here's your magic sign in link</div></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-bottom:30px;padding-left:0;word-break:break-word;"><div style="font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#8F8D92;">Tap the button below to sign in to your account. This link is valid for 6 hours or until it is used.</div></td></tr><tr><td align="left" vertical-align="middle" style="font-size:0px;padding:0;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#15121C" role="presentation" style="border:none;border-radius:100px;cursor:auto;mso-padding-alt:17px 24px;background:#15121C;" valign="middle"><a href="${data.link}" style="display:inline-block;background:#15121C;color:#ffffff;font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:20px;font-weight:400;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:17px 24px;mso-padding-alt:0px;border-radius:100px;" target="_blank">Log in to my account</a></td></tr></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table></td></tr><tr><td class="" width="600px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:536px;" width="536" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:536px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:536px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td style="vertical-align:top;padding:0;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%"><tbody><tr><td align="left" style="font-size:0px;padding:10px 25px;padding-right:0;padding-left:0;word-break:break-word;"><div style="font-family:'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:14px;text-align:left;color:#8F8D92;">With ❤️ from <a class="footer-link" href="https://www.epicbabynames.com" style="color: #15121C; text-decoration: none;">EpicBabyNames.com</a></div></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>`

        html: htmlOutput.html
      }
      
      // body: JSON.stringify({
      //   to: email,
      //   // from: 'team@epicbabynames.com',
      //   from: {
      //     email: 'team@epicbabynames.com',
      //     name: 'Epic Baby Names'
      //   },
      //   subject: 'Sending with SendGrid is Fun',
      //   text: 'and easy to do anywhere, even with Node.js',
      //   html: `<strong>and easy to do anywhere, even with Node.js. Here's even a <a href=${data.link}>sign in link</a></strong>`
      // }),

      // Use await instead of .then()
      await sendGridAdmin.send(msg);
      return res.status(200).json({ message: 'Email sent' });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}