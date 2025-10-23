import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Config Infomaniak optimisée (port 587 + STARTTLS)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.infomaniak.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // false pour 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      authMethod: 'LOGIN', // Infomaniak supporte LOGIN
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      logger: true,
      debug: true,
    });

    // Test connexion SMTP
    console.log('Testing SMTP connection...');
    await new Promise((resolve, reject) => {
      transporter.verify((error) => {
        if (error) {
          console.error('SMTP Verify Error:', error);
          reject(error);
        } else {
          console.log('✓ SMTP Connection Verified - Ready to send');
          resolve(true);
        }
      });
    });

    // Email to Esther House
    const mailOptions = {
      from: `"Contact Esther House" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM,
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    };

    console.log('Sending email to:', process.env.SMTP_FROM);
    await transporter.sendMail(mailOptions);
    console.log('✓ Email sent to Esther House');

    // Confirmation email to user
    const confirmationEmail = {
      from: `"Esther House" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Confirmation de réception - Esther House',
      html: `
        <h2>Merci pour votre message</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais.</p>
        <p>Cordialement,<br/>L'équipe Esther House</p>
      `,
    };

    console.log('Sending confirmation email to:', email);
    await transporter.sendMail(confirmationEmail);
    console.log('✓ Confirmation email sent to user');

    return NextResponse.json(
      { success: true, message: 'Message envoyé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const fullError = JSON.stringify(error, null, 2);
    console.error('❌ Email error:', errorMessage);
    console.error('Full error object:', fullError);
    
    return NextResponse.json(
      { error: `Erreur lors de l'envoi du message: ${errorMessage}` },
      { status: 500 }
    );
  }
}
