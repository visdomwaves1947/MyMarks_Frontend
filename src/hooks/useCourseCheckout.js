import { useCallback, useState } from 'react';
import useDialog from './useDialog';
import { createCourseOrder } from '../services/learningApi';
import payForOrder from '../utils/payForOrder';
import { COURSE_BOUGHT } from '../utils/purchaseEvents';

// Sent when a payment is confirmed, so an open course page and My Courses load again
export { COURSE_BOUGHT };

/**
 * Buy Now for one course: sign in first, then the payment, then the server checks it and onBought
 * reloads the page with every lesson open. The payment is Razorpay's checkout, or, while payments
 * are on the demo method, a confirmation on the site that takes no money.
 */
export default function useCourseCheckout({ course, access, isSignedIn, onOpenSignIn, onBought }) {
  const { alert, confirm } = useDialog();
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
      const { paid, isDemo } = await payForOrder(started, { alert, confirm });
      if (!paid) return;

      window.dispatchEvent(new CustomEvent(COURSE_BOUGHT, { detail: { courseId: course._id } }));
      await onBought();
      await alert({
        title: `You have ${course.name}`,
        message: isDemo
          ? 'Demo payment done, no money was taken. Every lesson is open now.'
          : 'Payment received. Every lesson is open now.',
        confirmLabel: 'Start Learning',
        tone: 'success',
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
  }, [access?.paymentsOpen, alert, confirm, course._id, course.name, isSignedIn, onBought, onOpenSignIn]);

  return { buy, buying };
}
