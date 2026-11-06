import { useCallback, useState } from 'react';
import useDialog from './useDialog';
import { createCourseOrder, verifyCoursePayment } from '../services/learningApi';
import { payWithRazorpay } from '../utils/razorpayCheckout';

/**
 * Buying a course: sign in first, then Razorpay's checkout, then the server checks the payment
 * and onBought reloads the page with every lesson open.
 */
export default function useCourseCheckout({ course, access, isSignedIn, onOpenSignIn, onBought }) {
  const { alert } = useDialog();
  const [buying, setBuying] = useState(false);

  const buy = useCallback(async () => {
    if (!isSignedIn) {
      onOpenSignIn();
      return;
    }
    if (!access?.paymentsOpen) {
      await alert({
        title: 'Online payments open soon',
        message: `You cannot pay online yet. Please contact us to join ${course.name}.`,
      });
      return;
    }

    setBuying(true);
    try {
      const started = await createCourseOrder(course._id);
      const checkout = await payWithRazorpay(started);
      if (!checkout.paid) {
        if (checkout.problem) {
          await alert({ title: 'The payment did not go through', message: `${checkout.problem} No money was taken.`, tone: 'danger' });
        }
        return;
      }

      await verifyCoursePayment(checkout.response);
      await onBought();
      await alert({
        title: `You have ${course.name}`,
        message: 'Payment received. Every lesson is open now.',
        confirmLabel: 'Start Learning',
      });
    } catch (error) {
      if (error.status === 401) {
        onOpenSignIn();
        return;
      }
      await alert({ title: 'Payment problem', message: error.message, tone: 'danger' });
    } finally {
      setBuying(false);
    }
  }, [access?.paymentsOpen, alert, course._id, course.name, isSignedIn, onBought, onOpenSignIn]);

  return { buy, buying };
}
