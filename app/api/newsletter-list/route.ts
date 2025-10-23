import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INFOMANIAK_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'Missing token' },
      { status: 400 }
    );
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  console.log('Listing all newsletter domains...');

  try {
    // Try to list all domains
    const listRes = await fetch(
      `https://api.infomaniak.com/1/newsletters`,
      { method: 'GET', headers }
    );

    const listText = await listRes.text();
    console.log('List domains status:', listRes.status);
    console.log('List domains response:', listText);

    let listData;
    try {
      listData = JSON.parse(listText);
    } catch {
      listData = listText;
    }

    return NextResponse.json({
      status: listRes.status,
      data: listData,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
