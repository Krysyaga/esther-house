import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    console.log('Newsletter subscription attempt:', email);

    const token = process.env.INFOMANIAK_API_TOKEN;
    const domainId = process.env.INFOMANIAK_NEWSLETTER_DOMAIN || '29187';

    if (!token) {
      console.error('Missing Infomaniak API token');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Add subscriber via Infomaniak API
    console.log('Adding subscriber to Infomaniak via API...');
    console.log('Domain ID:', domainId);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const addSubRes = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domainId}/subscribers`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const addSubText = await addSubRes.text();
    console.log('Infomaniak API response status:', addSubRes.status);
    console.log('Infomaniak API response body:', addSubText);

    let addSubData;
    try {
      addSubData = JSON.parse(addSubText);
    } catch {
      addSubData = addSubText;
    }

    if (!addSubRes.ok) {
      console.error('Failed to add subscriber to Infomaniak:', addSubData);
      // Continue anyway - still send confirmation email
    } else {
      console.log('✓ Subscriber added to Infomaniak');
    }

    // Configure Nodemailer with Infomaniak SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.infomaniak.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      authMethod: 'LOGIN',
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: `Esther House <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Confirmation de votre inscription à la newsletter - Esther House',
      html: `
        <div style="font-family: 'Jost', sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Merci de votre inscription !</h2>
          <p>Bonjour,</p>
          <p>Nous sommes heureux de vous compter parmi nos abonnés à la newsletter Esther House.</p>
          <p>Vous recevrez désormais :</p>
          <ul>
            <li>🎭 Les annonces de nos prochains événements</li>
            <li>🎵 Les actualités du théâtre</li>
            <li>🎟️ Des offres exclusives et réductions</li>
          </ul>
          <p>À bientôt,<br/>L'équipe Esther House</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin-top: 30px;" />
          <p style="font-size: 12px; color: #666;">
            Vous recevez cet email car vous avez demandé à vous abonner à notre newsletter.
          </p>
        </div>
      `,
    });

    // Send notification to admin
    await transporter.sendMail({
      from: `Esther House <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM,
      subject: 'Nouvelle inscription newsletter',
      html: `
        <h2>Nouvelle inscription à la newsletter</h2>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
      `,
    });

    console.log('✓ Newsletter subscription successful:', email);
    
    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An error occurred while subscribing' },
      { status: 500 }
    );
  }
}
