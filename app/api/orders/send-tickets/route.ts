import { NextRequest, NextResponse } from 'next/server';

const INFOMANIAK_API_KEY = process.env.INFOMANIAK_ETICKETS_API_KEY || 'b3ae1ff0da9c918cacf74920c5e4346b';
const INFOMANIAK_API_BASE = process.env.INFOMANIAK_ETICKETS_API_URL || 'https://etickets.infomaniak.com/api/shop';

interface SendTicketsRequest {
  orderId: string;
  email: string;
  mode?: 'pdf' | 'mobile';
}

export async function POST(request: NextRequest) {
  try {
    const body: SendTicketsRequest = await request.json();
    const { orderId, email, mode = 'pdf' } = body;

    if (!orderId || !email) {
      console.error('Missing orderId or email:', { orderId, email });
      return NextResponse.json(
        { error: 'Order ID and email are required' },
        { status: 400 }
      );
    }

    console.log(`[SEND-TICKETS] Attempting to send tickets for order ${orderId} to ${email} (mode: ${mode})`);

    // Build the endpoint - mode is optional in URL or body
    const endpoint = mode && mode !== 'pdf' 
      ? `${INFOMANIAK_API_BASE}/order/${orderId}/send-tickets/${mode}`
      : `${INFOMANIAK_API_BASE}/order/${orderId}/send-tickets`;
    
    console.log(`[SEND-TICKETS] Calling endpoint: ${endpoint}`);
    console.log(`[SEND-TICKETS] Request body:`, { email });

    const sendResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'key': INFOMANIAK_API_KEY,
        'Accept-Language': 'fr_FR',
        'currency': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const responseText = await sendResponse.text();
    console.log(`[SEND-TICKETS] Response status: ${sendResponse.status}`);
    console.log(`[SEND-TICKETS] Response body: ${responseText}`);

    if (!sendResponse.ok) {
      console.error(`[SEND-TICKETS] Failed to send tickets: ${sendResponse.status}`, responseText);
      return NextResponse.json(
        { 
          error: 'Failed to send tickets',
          status: sendResponse.status,
          details: responseText,
        },
        { status: sendResponse.status }
      );
    }

    // API returns "success" string on success
    console.log(`[SEND-TICKETS] ✓ Tickets sent successfully to ${email}`);
    return NextResponse.json({
      success: true,
      message: `Billets envoyés à ${email}`,
    });

  } catch (error) {
    console.error('[SEND-TICKETS] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
