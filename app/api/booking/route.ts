import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, event, date, tickets, message } = body;

    // Validation
    if (!name || !email || !event || !date || !tickets) {
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
      transporter.verify((error, success) => {
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
      from: `"Réservation Esther House" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM,
      subject: `Nouvelle réservation: ${event} - ${name}`,
      html: `
        <h2>Nouvelle demande de réservation</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type d'événement:</strong> ${event}</p>
        <p><strong>Date souhaitée:</strong> ${date}</p>
        <p><strong>Nombre de billets:</strong> ${tickets}</p>
        ${message ? `<p><strong>Informations supplémentaires:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      `,
      replyTo: email,
    };

    console.log('Sending booking email to:', process.env.SMTP_FROM);
    await transporter.sendMail(mailOptions);
    console.log('✓ Booking email sent to Esther House');

    // Confirmation email to user
    const confirmationEmail = {
      from: `"Esther House" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Confirmation de votre demande de réservation - Esther House',
      html: `
        <h2>Confirmation de réservation</h2>
        <p>Bonjour ${name},</p>
        <p>Merci pour votre demande de réservation pour l'événement <strong>${event}</strong> le <strong>${date}</strong> pour <strong>${tickets} billet(s)</strong>.</p>
        <p>Nous confirmerons votre réservation dans les meilleurs délais.</p>
        <p>Cordialement,<br/>L'équipe Esther House</p>
      `,
    };

    console.log('Sending confirmation email to:', email);
    await transporter.sendMail(confirmationEmail);
    console.log('✓ Confirmation email sent to user');

    return NextResponse.json(
      { success: true, message: 'Réservation envoyée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const fullError = JSON.stringify(error, null, 2);
    console.error('❌ Booking error:', errorMessage);
    console.error('Full error object:', fullError);
    
    return NextResponse.json(
      { error: `Erreur lors de l'envoi de la réservation: ${errorMessage}` },
      { status: 500 }
    );
  }
}
