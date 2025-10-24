"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Download, Mail } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface OrderData {
  status: string;
  orderId?: string;
  email?: string;
  tickets_link?: string;
  tickets_link_mobile?: string;
  message?: string;
  customer?: {
    email?: string;
  };
}

interface OrderStatus {
  status: 'success' | 'pending' | 'failed' | 'loading';
  orderId?: string;
  message?: string;
  data?: OrderData;
}

export default function OrderConfirmationPage() {
  const t = useTranslations('pages');
  const params = useParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({ status: 'loading' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const hasVerified = useRef(false);
  const hasAutoSent = useRef(false); // Track if we've already auto-sent tickets

  useEffect(() => {
    // Only run once per order ID
    if (hasVerified.current) return;

    const orderId = params.id as string;

    if (!orderId) {
      router.push('/cart');
      return;
    }

    hasVerified.current = true; // Mark as verified immediately

    // Verify order status with backend
    const verifyOrder = async () => {
      try {
        // Try to retrieve customer email from URL query parameter
        const searchParams = new URLSearchParams(window.location.search);
        const emailFromUrl = searchParams.get('email');
        console.log('[CONFIRMATION] Retrieved email from URL:', emailFromUrl);

        // Also try localStorage as fallback
        const storedEmail = localStorage.getItem(`order_${orderId}_email`);
        console.log('[CONFIRMATION] Retrieved email from localStorage:', storedEmail);

        const emailToUse = emailFromUrl || storedEmail;

        // Pass email as query parameter to the verification endpoint
        const verifyUrl = new URL(`/api/orders/verify/${orderId}`, window.location.origin);
        if (emailToUse) {
          verifyUrl.searchParams.set('email', emailToUse);
          console.log('[CONFIRMATION] Using email:', emailToUse);
        }

        const response = await fetch(verifyUrl.toString());

        if (!response.ok) {
          throw new Error('Failed to verify order');
        }

        const data = await response.json();

        // Inject the stored email if we have it
        if (storedEmail && (!data.customer || !data.customer.email)) {
          if (!data.customer) {
            data.customer = {};
          }
          data.customer.email = storedEmail;
          console.log('[CONFIRMATION] Injected email into order data:', storedEmail);
        }

        // Accept various success statuses
        const successStatuses = ['paid', 'completed', 'prebooked', 'validated', 'free'];
        const pendingStatuses = ['pending', 'processing'];

        if (successStatuses.includes(data.status)) {
          setOrderStatus({
            status: 'success',
            orderId: orderId,
            message: t('order_success_message'),
            data: data,
          });
          // Clear the cart after successful payment/booking
          clearCart();
        } else if (pendingStatuses.includes(data.status)) {
          setOrderStatus({
            status: 'pending',
            orderId: orderId,
            message: t('order_pending_message'),
            data: data,
          });
        } else {
          setOrderStatus({
            status: 'failed',
            orderId: orderId,
            message: t('order_failed_message'),
            data: data,
          });
        }
      } catch (error) {
        console.error('Order verification error:', error);
        setOrderStatus({
          status: 'failed',
          message: t('order_verification_error'),
        });
      }
    };

    verifyOrder();
  }, [params.id]); // Only depend on params.id

  const handleSendTickets = async (mode: 'pdf' | 'mobile' = 'pdf') => {
    if (!orderStatus.data?.customer?.email) {
      alert(t('email_not_found'));
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/orders/send-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderStatus.orderId,
          email: orderStatus.data.customer.email,
          mode,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        alert(`${t('tickets_sent')} ${orderStatus.data.customer.email}`);
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        alert(t('send_tickets_error'));
      }
    } catch (error) {
      console.error('Error sending tickets:', error);
      alert(t('send_tickets_error'));
    } finally {
      setSendingEmail(false);
    }
  };

  const downloadTickets = (format: 'pdf' | 'mobile' = 'pdf') => {
    const link = format === 'mobile' 
      ? orderStatus.data?.tickets_link_mobile 
      : orderStatus.data?.tickets_link;
    
    if (link) {
      window.open(link, '_blank');
    }
  };

  // Auto-send tickets when order is confirmed
  useEffect(() => {
    if (orderStatus.status === 'success' && orderStatus.data?.customer?.email && !hasAutoSent.current) {
      hasAutoSent.current = true;
      console.log('Auto-sending tickets to:', orderStatus.data.customer.email);
      
      // Send tickets automatically
      const autoSendTickets = async () => {
        setSendingEmail(true);
        try {
          const response = await fetch('/api/orders/send-tickets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderStatus.orderId,
              email: orderStatus.data?.customer?.email,
              mode: 'pdf',
            }),
          });

          if (response.ok) {
            setEmailSent(true);
            console.log('Tickets auto-sent successfully');
          } else {
            console.error('Failed to auto-send tickets');
          }
        } catch (error) {
          console.error('Error auto-sending tickets:', error);
        } finally {
          setSendingEmail(false);
        }
      };

      autoSendTickets();
    }
  }, [orderStatus.status, orderStatus.data?.customer?.email, orderStatus.orderId]);

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="relative w-full py-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {orderStatus.status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin" style={{ color: 'var(--brand-accent)' }} />
              <h1
                className="text-3xl md:text-4xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('verifying_order')}
              </h1>
              <p
                className="text-gray-400 text-lg"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('please_wait')}
              </p>
            </>
          )}

          {orderStatus.status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--brand-accent)' }} />
              <h1
                className="text-3xl md:text-4xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('order_confirmed')}
              </h1>
              <div className="w-12 h-1 mx-auto mb-8" style={{ backgroundColor: "var(--brand-accent)" }} />

              <div className="border border-white/20 rounded-lg p-8 bg-white/5 mb-8">
                <p
                  className="text-xl mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {orderStatus.message}
                </p>
                <p
                  className="text-gray-400 mb-2"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('order_number')}:
                </p>
                <p
                  className="text-2xl font-bold mb-6"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: 'var(--brand-accent)'
                  }}
                >
                  #{orderStatus.orderId}
                </p>
                <p
                  className="text-gray-400"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('order_email_sent')}
                </p>

                {/* Tickets section */}
                {(orderStatus.data?.tickets_link || orderStatus.data?.tickets_link_mobile) && (
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <p
                      className="text-gray-400 mb-4"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      Vos billets:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {orderStatus.data?.tickets_link && (
                        <button
                          onClick={() => downloadTickets('pdf')}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 hover:opacity-90 border border-white/20 hover:border-white/40"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          <Download className="w-4 h-4" />
                          Télécharger (PDF)
                        </button>
                      )}
                      {orderStatus.data?.tickets_link_mobile && (
                        <button
                          onClick={() => downloadTickets('mobile')}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 hover:opacity-90 border border-white/20 hover:border-white/40"
                          style={{ fontFamily: "'Jost', sans-serif" }}
                        >
                          <Download className="w-4 h-4" />
                          Télécharger (Mobile)
                        </button>
                      )}
                      {orderStatus.data?.customer?.email && (
                        <button
                          onClick={() => handleSendTickets('pdf')}
                          disabled={sendingEmail}
                          className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold text-sm tracking-wider transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            backgroundColor: 'var(--brand-accent)',
                            color: 'white'
                          }}
                        >
                          {sendingEmail ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Envoi...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4" />
                              Envoyer par email
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {emailSent && (
                      <p className="text-green-400 text-sm mt-3" style={{ fontFamily: "'Jost', sans-serif" }}>
                        ✓ Billets envoyés avec succès!
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/events"
                className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  backgroundColor: 'var(--brand-accent)',
                  color: 'white'
                }}
              >
                {t('back_to_events')}
              </Link>
            </>
          )}

          {orderStatus.status === 'pending' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-yellow-500" />
              <h1
                className="text-3xl md:text-4xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('order_pending')}
              </h1>
              <div className="w-12 h-1 mx-auto mb-8 bg-yellow-500" />

              <div className="border border-yellow-500/20 rounded-lg p-8 bg-yellow-500/5 mb-8">
                <p
                  className="text-xl mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {orderStatus.message}
                </p>
                <p
                  className="text-gray-400 mb-2"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {t('order_number')}:
                </p>
                <p
                  className="text-2xl font-bold mb-6 text-yellow-500"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  #{orderStatus.orderId}
                </p>
              </div>

              <Link
                href="/events"
                className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-white/10 border border-white/20 mr-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('back_to_events')}
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  backgroundColor: 'var(--brand-accent)',
                  color: 'white'
                }}
              >
                {t('refresh')}
              </button>
            </>
          )}

          {orderStatus.status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
              <h1
                className="text-3xl md:text-4xl font-bold uppercase mb-4"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('order_failed')}
              </h1>
              <div className="w-12 h-1 mx-auto mb-8 bg-red-500" />

              <div className="border border-red-500/20 rounded-lg p-8 bg-red-500/5 mb-8">
                <p
                  className="text-xl mb-4"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {orderStatus.message}
                </p>
                {orderStatus.orderId && (
                  <>
                    <p
                      className="text-gray-400 mb-2"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      {t('order_number')}:
                    </p>
                    <p
                      className="text-2xl font-bold mb-6 text-red-500"
                      style={{ fontFamily: "'Jost', sans-serif" }}
                    >
                      #{orderStatus.orderId}
                    </p>
                  </>
                )}
              </div>

              <Link
                href="/cart"
                className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:opacity-90 mr-4"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  backgroundColor: 'var(--brand-accent)',
                  color: 'white'
                }}
              >
                {t('back_to_cart')}
              </Link>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:bg-white/10 border border-white/20"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                {t('contact_support')}
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
