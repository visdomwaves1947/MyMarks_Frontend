import { useCallback, useState } from 'react';
import useDialog from './useDialog';
import { createCourseOrder } from '../services/learningApi';
import payForOrder from '../utils/payForOrder';
import { COURSE_BOUGHT } from '../utils/purchaseEvents';
import { removeManyFromCart } from './useCart';

/**
 * The checkout's Pay button, for the cart or one course (Buy Now): one Razorpay payment (or one demo
 * confirmation) for the total, then every course opens. Courses the student already has are taken
 * out of the cart first. onPaid(courses) runs once the server has checked the payment.
 */
export default function useCartCheckout({ isSignedIn, onOpenSignIn, onPaid }) {
  const { alert, confirm } = useDialog();
  const [paying, setPaying] = useState(false);

  const checkout = useCallback(
    async (items) => {
      if (items.length === 0) return;
      if (!isSignedIn) {
        onOpenSignIn();
        return;
      }

      setPaying(true);
      try {
        const started = await createCourseOrder(items.map((item) => item.id));
        const { paid, isDemo } = await payForOrder(started, { alert, confirm });
        if (!paid) return;

        const courses = started.courses || [];
        const ids = courses.map((course) => course.id);
        window.dispatchEvent(new CustomEvent(COURSE_BOUGHT, { detail: { courseId: ids[0], courseIds: ids } }));
        await alert({
          title: courses.length === 1 ? `You have ${courses[0].name}` : `You have ${courses.length} new courses`,
          message: isDemo
            ? 'Demo payment done, no money was taken. Every lesson is open now.'
            : 'Payment received. Every lesson is open now.',
          confirmLabel: courses.length === 1 ? 'Start Learning' : 'Go to My Courses',
          tone: 'success',
        });
        onPaid?.(courses);
      } catch (error) {
        if (error.status === 401) {
          onOpenSignIn();
          return;
        }
        if (error.status === 409 && error.data?.owned?.length) {
          removeManyFromCart(error.data.owned);
          await alert({
            title: 'Already in My Courses',
            message: `${error.message} It was taken out of your cart. Check the total and pay again.`,
          });
          return;
        }
        if (error.status === 503) {
          await alert({ title: 'Online payments open soon', message: 'You cannot pay online yet. Please contact us to join these courses.' });
          return;
        }
        await alert({ title: 'Payment problem', message: error.message, tone: 'danger' });
      } finally {
        setPaying(false);
      }
    },
    [alert, confirm, isSignedIn, onOpenSignIn, onPaid]
  );

  return { checkout, paying };
}
