import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INFOMANIAK_API_TOKEN;
  const domainId = process.env.INFOMANIAK_NEWSLETTER_DOMAIN || '29187';

  if (!token) {
    return NextResponse.json(
      { error: 'Missing token', token: !!token },
      { status: 400 }
    );
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  console.log('Testing Newsletter API...');
  console.log('Domain ID:', domainId);
  console.log('Token length:', token.length);

  const results: any = {};

  // Test 1: Get domain info with /1/newsletters/{domain}
  try {
    console.log('Testing domain info with GET /1/newsletters/{id}...');
    const domainRes = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domainId}`,
      { method: 'GET', headers }
    );
    const domainData = await domainRes.json();
    console.log('Domain check status:', domainRes.status);
    console.log('Domain check response:', domainData);
    results.domain_info = { status: domainRes.status, data: domainData };
  } catch (error) {
    console.error('Domain error:', error);
    results.domain_info = { error: String(error) };
  }

  // Test 2: List subscribers with /1/newsletters/{domain}/subscribers
  try {
    console.log('Testing subscribers list with GET /1/newsletters/{id}/subscribers...');
    const contactsRes = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domainId}/subscribers`,
      { method: 'GET', headers }
    );
    const contactsData = await contactsRes.json();
    console.log('Subscribers check status:', contactsRes.status);
    console.log('Subscribers check response:', contactsData);
    results.subscribers_list = { status: contactsRes.status, data: contactsData };
  } catch (error) {
    console.error('Subscribers error:', error);
    results.subscribers_list = { error: String(error) };
  }

  // Test 3: Try to add a test subscriber
  try {
    console.log('Testing add subscriber with POST /1/newsletters/{id}/subscribers...');
    const addRes = await fetch(
      `https://api.infomaniak.com/1/newsletters/${domainId}/subscribers`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: 'test-' + Date.now() + '@example.com',
          status: 'subscribed',
        }),
      }
    );
    const addData = await addRes.json();
    console.log('Add subscriber status:', addRes.status);
    console.log('Add subscriber response:', addData);
    results.add_subscriber = { status: addRes.status, data: addData };
  } catch (error) {
    console.error('Add subscriber error:', error);
    results.add_subscriber = { error: String(error) };
  }

  return NextResponse.json(results);
}
