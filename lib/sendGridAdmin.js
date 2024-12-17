// import * as admin from 'firebase-admin';

// const sgMail = require('@sendgrid/mail')
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendGridAdmin = sgMail;