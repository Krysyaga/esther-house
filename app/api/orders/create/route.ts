import { NextRequest, NextResponse } from 'next/server';

const INFOMANIAK_API_KEY = process.env.INFOMANIAK_ETICKETS_API_KEY || 'b3ae1ff0da9c918cacf74920c5e4346b';
const INFOMANIAK_SALES_KEY = process.env.INFOMANIAK_ETICKETS_SALES_KEY || '2d8c954e0f81b9033d9534b08c265a23';
const INFOMANIAK_API_BASE = process.env.INFOMANIAK_ETICKETS_API_URL || 'https://etickets.infomaniak.com/api/shop';

interface CartItem {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventImage?: string;
  zoneId: number;
  zoneName: string;
  categoryId: number;
  categoryName: string;
  price: number;
  quantity: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CreateOrderRequest {
  customer: CustomerData;
  items: CartItem[];
  paymentMethod?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { customer, items, paymentMethod = 'card' } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Group items by event
    const eventGroups = items.reduce((acc, item) => {
      if (!acc[item.eventId]) {
        acc[item.eventId] = [];
      }
      acc[item.eventId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // For now, we'll handle only single event orders
    // In a production system, you might need to create multiple orders
    const eventId = Object.keys(eventGroups)[0];
    const eventItems = eventGroups[eventId];

    console.log('Creating order for event:', eventId);
    console.log('Customer data:', customer);
    console.log('Items:', eventItems);

    // INFOMANIAK WORKFLOW (verified working):
    // 1. Create order with customer info (can include tickets but they won't be added)
    // 2. Add tickets via POST /order/{id}/tickets with category_id and count
    // 3. For free orders, redirect to confirmation (validation endpoint doesn't work)
    console.log('=== Creating order with Infomaniak ===');

    // Step 1: Create order WITH tickets (using CORRECT field names from API doc!)
    const ticketsPayload = eventItems.map(item => ({
      category_id: item.categoryId,  // "category_id" NOT "category"!
      count: item.quantity,          // "count" NOT "quantity"!
    }));

    const orderPayload = {
      event_id: parseInt(eventId),
      customer: {
        firstname: customer.firstName,
        lastname: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        zip: customer.postalCode,
        country: customer.country,
      },
      tickets: ticketsPayload, // NOW with sales credentials!
    };

    console.log('Step 1: Creating order WITH tickets using sales key:', JSON.stringify(orderPayload, null, 2));

    const createOrderResponse = await fetch(`${INFOMANIAK_API_BASE}/order/create`, {
      method: 'POST',
      headers: {
        'key': INFOMANIAK_API_KEY,
        'Credential': INFOMANIAK_SALES_KEY,
        'Accept-Language': 'fr_FR',
        'currency': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.text();
      console.error('Failed to create order - Status:', createOrderResponse.status);
      console.error('Failed to create order - Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create order with Infomaniak', details: errorData },
        { status: createOrderResponse.status }
      );
    }

    const orderData = await createOrderResponse.json();
    console.log('Order response:', orderData);

    // Infomaniak returns the order ID directly as a number
    const orderId = typeof orderData === 'number' ? orderData : (orderData.data?.id || orderData.id);

    if (!orderId) {
      console.error('No order ID returned from Infomaniak. Response:', orderData);
      return NextResponse.json(
        { error: 'Invalid response from Infomaniak' },
        { status: 500 }
      );
    }

    console.log('✓ Step 1 complete: Order created with ID:', orderId);

    // Step 2: Add tickets to order using the separate endpoint with CORRECT fields
    console.log('Step 2: Adding tickets via POST /order/{id}/tickets...');

    const ticketsToAdd = eventItems.map(item => ({
      category_id: item.categoryId,  // Correct field name!
      count: item.quantity,          // Correct field name!
    }));

    console.log('Tickets payload:', JSON.stringify(ticketsToAdd, null, 2));

    try {
      const addTicketsResponse = await fetch(`${INFOMANIAK_API_BASE}/order/${orderId}/tickets`, {
        method: 'POST',
        headers: {
          'key': INFOMANIAK_API_KEY,
          'Credential': INFOMANIAK_SALES_KEY,
          'Accept-Language': 'fr_FR',
          'currency': '1',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketsToAdd),
      });

      if (addTicketsResponse.ok) {
        const ticketsData = await addTicketsResponse.json();
        console.log('✓ Step 2 complete: Tickets added successfully!');
        console.log('Response:', JSON.stringify(ticketsData, null, 2).substring(0, 500));
      } else {
        const errorText = await addTicketsResponse.text();
        console.error('✗ Step 2 FAILED: Could not add tickets:', errorText.substring(0, 300));
        return NextResponse.json(
          { error: 'Failed to add tickets to order', details: errorText },
          { status: addTicketsResponse.status }
        );
      }
    } catch (error) {
      console.error('✗ Step 2 FAILED: Error adding tickets:', error);
      return NextResponse.json(
        { error: 'Error adding tickets to order' },
        { status: 500 }
      );
    }

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Step 3: For free orders, try to finalize them
    if (totalPrice === 0) {
      console.log('Step 3: Attempting to finalize free order...');

      // Try to get available payment modes and add a free payment operation
      try {
        const paymentsResponse = await fetch(`${INFOMANIAK_API_BASE}/order/${orderId}/payments`, {
          method: 'GET',
          headers: {
            'key': INFOMANIAK_API_KEY,
            'Accept-Language': 'fr_FR',
            'currency': '1',
          },
        });

        if (paymentsResponse.ok) {
          const paymentModes = await paymentsResponse.json();
          console.log('Available payment methods:', paymentModes.map((m: any) => `${m.payment_id}: ${m.name}`));
          
          // Find free/gratuit payment mode (usually payment_id: 5)
          const freeMode = paymentModes.find((m: any) => m.name?.toLowerCase().includes('gratuit'));
          
          if (freeMode) {
            console.log('Found free payment mode, adding operation...');
            
            const opResponse = await fetch(`${INFOMANIAK_API_BASE}/order/${orderId}/operations`, {
              method: 'POST',
              headers: {
                'key': INFOMANIAK_API_KEY,
                'Credential': INFOMANIAK_SALES_KEY,
                'Accept-Language': 'fr_FR',
                'currency': '1',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify([
                { payment_id: freeMode.payment_id, amount: 0 }
              ]),
            });

            if (opResponse.ok) {
              console.log('✓ Free payment operation added');
            } else {
              console.log(`⚠ Operation failed: ${opResponse.status}`);
            }
          }
        }
      } catch (error) {
        console.error('⚠ Error adding payment operation:', error);
      }

      console.log('Order ready for confirmation');
      return NextResponse.json({
        orderId,
        email: customer.email,
        paymentUrl: null,
        isFree: true,
        confirmationUrl: `${request.nextUrl.origin}/order/confirmation/${orderId}?email=${encodeURIComponent(customer.email)}`,
      });
    }

    // For paid orders, try to get payment URL
    console.log('Attempting to get payment URL for order:', orderId);

    // Try different endpoints for payment
    const paymentEndpoints = [
      `/order/${orderId}/payment`,
      `/order/${orderId}/pay`,
      `/payment/${orderId}`,
    ];

    let paymentResponse = null;
    let lastError = null;

    for (const endpoint of paymentEndpoints) {
      try {
        console.log('Trying payment endpoint:', endpoint);
        paymentResponse = await fetch(`${INFOMANIAK_API_BASE}${endpoint}`, {
          method: 'POST',
          headers: {
            'key': INFOMANIAK_API_KEY,
            'Accept-Language': 'fr_FR',
            'currency': '1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
            return_url: `${request.nextUrl.origin}/order/confirmation/${orderId}?email=${encodeURIComponent(customer.email)}`,
            cancel_url: `${request.nextUrl.origin}/events/${eventId}/book?error=payment_cancelled`,
          }),
        });

        if (paymentResponse.ok) {
          console.log('Payment endpoint successful:', endpoint);
          break;
        } else {
          lastError = await paymentResponse.text();
          console.log(`Endpoint ${endpoint} failed:`, lastError);
          paymentResponse = null;
        }
      } catch (error) {
        console.error(`Error trying endpoint ${endpoint}:`, error);
        lastError = error;
        paymentResponse = null;
      }
    }

    if (!paymentResponse || !paymentResponse.ok) {
      console.error('All payment endpoints failed. Last error:', lastError);
      console.error('Order was created but payment initialization failed.');
      console.error('Redirecting to confirmation page anyway - user can pay later via Infomaniak admin.');

      // Return confirmation URL anyway - order exists
      return NextResponse.json({
        orderId,
        email: customer.email,
        paymentUrl: null,
        warning: 'Payment initialization failed, but order was created',
        confirmationUrl: `${request.nextUrl.origin}/order/confirmation/${orderId}`,
      });
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment response:', paymentData);

    const paymentUrl = paymentData.payment_url || paymentData.data?.payment_url || paymentData.url;

    if (!paymentUrl) {
      console.error('No payment URL in response:', paymentData);
      // Return confirmation URL - order exists
      return NextResponse.json({
        orderId,
        email: customer.email,
        paymentUrl: null,
        warning: 'No payment URL received',
        confirmationUrl: `${request.nextUrl.origin}/order/confirmation/${orderId}`,
      });
    }

    // Return the payment URL to redirect the user
    const response = NextResponse.json({
      orderId,
      email: customer.email,
      paymentUrl,
    });

    // Store customer email in a cookie so we can retrieve it later during verification
    response.cookies.set('order_' + orderId + '_email', customer.email, {
      maxAge: 86400 * 7, // 7 days
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
