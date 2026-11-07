import { confirmDemoPayment, verifyCoursePayment } from '../services/learningApi';
import { payWithRazorpay } from './razorpayCheckout';
import { formatPrice } from './courseImage';

/**
 * The payment step of an order the server made, for Buy Now and for the cart alike: Razorpay's
 * checkout, or, while payments are on the demo method, a confirmation on the site that takes no money.
 * Resolves { paid, isDemo }. The server checks the payment before anything opens.
 */
export default async function payForOrder(started, { alert, confirm }) {
  const isDemo = started.provider === 'demo';

  if (isDemo) {
    const price = formatPrice(started.order.amount / 100);
    const ok = await confirm({
      title: 'Demo payment',
      message: `This is a demo: no money is taken. Pay ${price} for ${started.course.name} to see what happens after a payment.`,
      confirmLabel: `Pay ${price} (demo)`,
      cancelLabel: 'Cancel',
    });
    if (!ok) return { paid: false, isDemo };
    await confirmDemoPayment(started.order.id);
    return { paid: true, isDemo };
  }

  const checkout = await payWithRazorpay(started);
  if (!checkout.paid) {
    if (checkout.problem) {
      // Razorpay's reason may have no full stop of its own
      const reason = /[.!?]$/.test(checkout.problem.trim()) ? checkout.problem.trim() : `${checkout.problem.trim()}.`;
      await alert({ title: 'The payment did not go through', message: `${reason} No money was taken.`, tone: 'danger' });
    }
    return { paid: false, isDemo };
  }
  await verifyCoursePayment(checkout.response);
  return { paid: true, isDemo };
}
