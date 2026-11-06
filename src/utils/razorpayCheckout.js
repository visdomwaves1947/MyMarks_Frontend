// Razorpay's own checkout window. The script loads only when a student presses Buy.

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

let loading = null;

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHECKOUT_SCRIPT;
      script.async = true;
      script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay did not start.')));
      script.onerror = () => {
        loading = null;
        reject(new Error('Razorpay could not be loaded. Please check your connection and try again.'));
      };
      document.body.appendChild(script);
    });
  }
  return loading;
}

/**
 * Opens the checkout for an order the server made.
 * Resolves { paid: true, response } with Razorpay's signed answer, or { paid: false, problem } when
 * the student closes the window (problem is Razorpay's reason when a payment attempt failed).
 */
export async function payWithRazorpay({ keyId, order, course, prefill }) {
  const Razorpay = await loadRazorpay();

  return new Promise((resolve) => {
    let problem = '';
    const checkout = new Razorpay({
      key: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      name: 'MyMarks',
      description: course.name,
      prefill,
      notes: { course: course.name },
      theme: { color: '#2563EB' },
      handler: (response) => resolve({ paid: true, response }),
      modal: {
        confirm_close: true,
        ondismiss: () => resolve({ paid: false, problem }),
      },
    });
    // The window stays open after a failed attempt so the student can try again
    checkout.on('payment.failed', (answer) => {
      problem = answer?.error?.description || 'The payment did not go through.';
    });
    checkout.open();
  });
}
