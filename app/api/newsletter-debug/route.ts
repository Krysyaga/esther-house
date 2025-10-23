import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INFOMANIAK_API_TOKEN;
  const domain = process.env.INFOMANIAK_NEWSLETTER_DOMAIN;

  if (!token || !domain) {
    return NextResponse.json(
      { error: 'Missing credentials', token: !!token, domain: !!domain },
      { status: 400 }
    );
  }

  try {
    console.log('Testing Infomaniak Newsletter API...');
    console.log('Domain ID to test:', domain);
    console.log('Token exists:', !!token);

    // Test 1: Get API key for this newsletter domain
    const apiKeyResponse = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domain}/api-key`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const apiKeyData = await apiKeyResponse.text();
    console.log('API Key check status:', apiKeyResponse.status);
    console.log('API Key check response:', apiKeyData);

    // Test 2: Get domain info
    const domainResponse = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domain}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const domainData = await domainResponse.text();
    console.log('Domain check status:', domainResponse.status);
    console.log('Domain check response:', domainData);

    // Test 3: Try to subscribe
    const subscriberResponse = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domain}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      }
    );

    const subscriberData = await subscriberResponse.text();
    console.log('Subscriber test status:', subscriberResponse.status);
    console.log('Subscriber test response:', subscriberData);

    return NextResponse.json({
      api_key_check: {
        status: apiKeyResponse.status,
        body: JSON.parse(apiKeyData),
      },
      domain_check: {
        status: domainResponse.status,
        body: JSON.parse(domainData),
      },
      subscriber_test: {
        status: subscriberResponse.status,
        body: JSON.parse(subscriberData),
      },
      config: {
        domain,
        tokenLength: token.length,
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
