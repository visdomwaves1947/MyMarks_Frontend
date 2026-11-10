import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CheckCircle2, CreditCard, Lock, ShieldCheck, ShoppingCart } from 'lucide-react';
import useCart, { cartItemOf } from '../hooks/useCart';
import useCartCheckout from '../hooks/useCartCheckout';
import useMyCourses from '../hooks/useMyCourses';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { fetchCoursePage } from '../services/courseApi';
import { fetchPaymentConfig } from '../services/learningApi';
import { courseImage, formatPrice, showDefaultImage } from '../utils/courseImage';
import NoticePanel from '../components/ui/NoticePanel';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';

function Step({ number, title, done = false, locked = false, children }) {
  return (
    <section data-testid={`checkout-step-${number}`} className={`${PANEL} p-5 sm:p-6`}>
      <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-950 dark:text-white">
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
            done
              ? 'bg-emerald-600 text-white'
              : locked
                ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                : 'bg-blue-600 text-white'
          }`}
        >
          {done ? <Check size={14} /> : number}
        </span>
        <span className={locked ? 'text-slate-500 dark:text-slate-400' : ''}>{title}</span>
        {locked && <Lock size={15} className="ml-auto text-slate-400" aria-label="Opens after you sign in" />}
      </h2>
      {!locked && <div className="mt-4 sm:pl-9">{children}</div>}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{value || 'Not given'}</div>
    </div>
  );
}

function OrderItem({ item, owned }) {
  return (
    <li data-testid="checkout-item" className="py-3 flex items-center gap-3">
      <img
        src={courseImage(item.image, 240)}
        onError={showDefaultImage}
        alt=""
        className="w-16 h-11 sm:w-20 sm:h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{item.name}</div>
        {owned && (
          <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={12} />
            <span>Already in My Courses, so it is left out</span>
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className={`text-sm font-bold ${owned ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
          {formatPrice(item.price)}
        </div>
        {!owned && item.oldPrice > item.price && (
          <div className="text-xs text-slate-500 dark:text-slate-400 line-through">{formatPrice(item.oldPrice)}</div>
        )}
      </div>
    </li>
  );
}

// Buy Now sends one course (?course=slug); otherwise the checkout is the cart
function useOrderCourses(slug) {
  const cart = useCart();
  const [express, setExpress] = useState({ slug: null, status: 'loading', item: null, access: null });

  useEffect(() => {
    if (!slug) return undefined;
    let live = true;
    fetchCoursePage(slug).then(
      (data) =>
        live &&
        setExpress(
          data?.course
            ? { slug, status: 'ready', item: cartItemOf(data.course), access: data.access || {} }
            : { slug, status: 'missing', item: null, access: null }
        ),
      () => live && setExpress({ slug, status: 'error', item: null, access: null })
    );
    return () => {
      live = false;
    };
  }, [slug]);

  if (!slug) return { mode: 'cart', status: 'ready', items: cart.items };
  if (express.slug !== slug) return { mode: 'express', status: 'loading', items: [] };
  return { mode: 'express', status: express.status, items: express.item ? [express.item] : [], access: express.access };
}

/**
 * Checkout, for the cart or for one course from Buy Now: 1. the account, 2. billing details and the
 * payment method (open once signed in), the order, and the order summary with one Pay button.
 */
export default function CheckoutPage({ currentUser, onOpenSignIn, onOpenSignUp }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const slug = params.get('course');
  const order = useOrderCourses(slug);
  const mine = useMyCourses(currentUser);
  const [payments, setPayments] = useState(null);
  useDocumentMeta({ title: 'Checkout | MyMarks', description: 'Pay for your MyMarks courses.' });

  useEffect(() => {
    let live = true;
    fetchPaymentConfig().then(
      (config) => live && setPayments(config),
      () => live && setPayments({ enabled: false, provider: '' })
    );
    return () => {
      live = false;
    };
  }, []);

  const signedIn = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';
  const ownedIds = new Set(mine.courses.map((course) => course.courseId));
  if (order.access?.owned && order.items[0]) ownedIds.add(order.items[0].id);
  const toPay = order.items.filter((item) => !ownedIds.has(item.id));
  const total = toPay.reduce((sum, item) => sum + item.price, 0);
  const original = toPay.reduce((sum, item) => sum + Math.max(item.oldPrice, item.price), 0);
  const discount = original - total;
  const open = Boolean(payments?.enabled);
  const demo = open && payments.provider === 'demo';

  const { checkout, paying } = useCartCheckout({
    isSignedIn: signedIn,
    onOpenSignIn,
    onPaid: (courses) => navigate(courses.length === 1 && courses[0].slug ? `/courses/${courses[0].slug}` : '/my-courses'),
  });

  const back = order.mode === 'express' ? { to: `/courses/${slug}`, label: 'Back to Course' } : { to: '/cart', label: 'Back to Cart' };

  let body;
  if (order.status === 'loading') {
    body = <p className="text-sm text-slate-500 dark:text-slate-400">Loading your order...</p>;
  } else if (order.status !== 'ready') {
    body = (
      <NoticePanel
        testId="checkout-problem"
        icon={<ShoppingCart size={26} />}
        title={order.status === 'missing' ? 'This course is not available' : 'We could not load this course'}
        actions={[back]}
      >
        {order.status === 'missing' ? 'It may have been moved or is no longer sold.' : 'Please check your connection and try again.'}
      </NoticePanel>
    );
  } else if (isAdmin) {
    // Administrators see every lesson; say so plainly, with a way back
    body = (
      <NoticePanel
        testId="checkout-admin"
        icon={<ShieldCheck size={26} />}
        title="You are signed in as an administrator"
        actions={[back, { to: '/admin', label: 'Admin Panel' }]}
      >
        Administrators see every lesson, so there is nothing to buy. To try buying, sign in with a student account.
      </NoticePanel>
    );
  } else if (order.mode === 'express' && order.access?.owned) {
    body = (
      <p data-testid="checkout-owned" className="text-sm text-slate-600 dark:text-slate-400">
        You already have {order.items[0]?.name}.{' '}
        <Link to={back.to} className="font-semibold text-blue-600 dark:text-cyan-400">Start Learning</Link>
      </p>
    );
  } else if (order.mode === 'express' && order.access && !order.access.forSale) {
    body = (
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This course is not sold online. <Link to={back.to} className="font-semibold text-blue-600">Open the course</Link>
      </p>
    );
  } else if (order.items.length === 0) {
    body = (
      <div data-testid="checkout-empty" className={`${PANEL} max-w-md p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <ShoppingCart size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Nothing to pay for</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Your cart is empty.</p>
        <Link to="/demo#courses" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold">
          Browse Courses
        </Link>
      </div>
    );
  } else {
    const count = toPay.length;
    const name = currentUser?.fullName || currentUser?.name || '';
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-3 space-y-4">
          <Step number={1} title={signedIn ? 'Account' : 'Sign in or create an account'} done={signedIn}>
            {signedIn ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Signed in as <span className="font-semibold text-slate-950 dark:text-white">{name || currentUser.email}</span>
                {currentUser.email && name ? ` (${currentUser.email})` : ''}. The courses are added to this account.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Sign in to buy, or create a free account. Your order waits here.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={onOpenSignIn}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={onOpenSignUp}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm font-bold cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </Step>

          <Step number={2} title="Billing details and payment method" locked={!signedIn}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Detail label="Name" value={name} />
                <Detail label="Email" value={currentUser?.email} />
                <Detail label="Mobile" value={currentUser?.mobileNumber} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These go to the payment window for you. Change them on <Link to="/profile" className="font-semibold text-blue-600 dark:text-cyan-400">your profile</Link>.
              </p>
              {open ? (
                <div className="p-3.5 rounded-2xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30 flex items-start gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full border-[5px] border-blue-600 bg-white shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold text-slate-950 dark:text-white flex items-center gap-1.5">
                      <CreditCard size={15} />
                      <span>{demo ? 'Demo payment' : 'UPI, cards, net banking and wallets'}</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {demo ? 'For trying the site: no real money is taken.' : "You choose in Razorpay's secure payment window."}
                    </div>
                  </div>
                </div>
              ) : (
                payments && (
                  <p className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-sm text-amber-900 dark:text-amber-200">
                    Online payment opens soon. Please contact us to join {count === 1 ? 'this course' : 'these courses'}.
                  </p>
                )
              )}
            </div>
          </Step>
        </div>

        <aside
          data-testid="checkout-summary"
          className="lg:col-span-2 lg:row-span-2 p-5 sm:p-6 space-y-4 lg:sticky lg:top-28 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-[#0F172A]"
        >
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
              <dt>Original price</dt>
              <dd>{formatPrice(original)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
                <dt>Discount ({Math.round((discount / original) * 100)}% off)</dt>
                <dd>-{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-base">
              <dt className="font-bold text-slate-950 dark:text-white">
                Total <span className="font-normal">({count} {count === 1 ? 'course' : 'courses'})</span>
              </dt>
              <dd data-testid="checkout-total" className="font-black text-slate-950 dark:text-white">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            data-testid="checkout-pay"
            onClick={() => (signedIn ? checkout(toPay) : onOpenSignIn())}
            disabled={paying || count === 0 || (signedIn && !open)}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock size={15} />
            <span>
              {paying ? 'Opening payment...' : !signedIn ? 'Sign In to Continue' : !open ? 'Online payment opens soon' : `Pay ${formatPrice(total)}${demo ? ' (demo)' : ''}`}
            </span>
          </button>
          <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} className="shrink-0 mt-px text-emerald-600" />
            <span>
              {demo
                ? 'Demo payment: no real money is taken, and every course opens at once.'
                : 'Paid securely with Razorpay. Every course opens as soon as the payment is confirmed.'}
            </span>
          </p>
        </aside>

        <section className={`${PANEL} lg:col-span-3 p-5 sm:p-6`}>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              Order details <span className="font-normal text-slate-500 dark:text-slate-400">({order.items.length} {order.items.length === 1 ? 'course' : 'courses'})</span>
            </h2>
            <ul className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item) => (
                <OrderItem key={item.id} item={item} owned={ownedIds.has(item.id)} />
              ))}
            </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <Link
          to={back.to}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all"
        >
          <ArrowLeft size={16} />
          <span>{back.label}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">Checkout</h1>
        {body}
      </div>
    </div>
  );
}
