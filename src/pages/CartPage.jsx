import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingCart, Trash2 } from 'lucide-react';
import useCart, { removeFromCart } from '../hooks/useCart';
import useMyCourses from '../hooks/useMyCourses';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { courseImage, formatPrice, showDefaultImage } from '../utils/courseImage';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';

function CartItem({ item, owned }) {
  return (
    <li data-testid="cart-item" className="p-3 sm:p-4 flex gap-3 sm:gap-4">
      <Link to={`/courses/${item.slug}`} className="shrink-0">
        <img
          src={courseImage(item.image, 320)}
          onError={showDefaultImage}
          alt=""
          className="w-24 h-16 sm:w-36 sm:h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/courses/${item.slug}`}
            className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-300 line-clamp-2"
          >
            {item.name}
          </Link>
          {owned ? (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={13} />
              <span>You have this course, so it is not in the total</span>
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Every lesson opens once you pay.</p>
          )}
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        </div>
        <div className="sm:text-right shrink-0">
          <div className={`text-base font-black ${owned ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
            {formatPrice(item.price)}
          </div>
          {!owned && item.oldPrice > item.price && (
            <div className="text-xs text-slate-500 dark:text-slate-400 line-through">{formatPrice(item.oldPrice)}</div>
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * The cart: the courses picked with Add to Cart and their total. Paying happens on the Checkout page.
 */
export default function CartPage({ currentUser }) {
  const navigate = useNavigate();
  const cart = useCart();
  const mine = useMyCourses(currentUser);
  useDocumentMeta({ title: 'Cart | MyMarks', description: 'The MyMarks courses in your cart.' });

  const isAdmin = currentUser?.role === 'admin';
  const ownedIds = new Set(mine.courses.map((course) => course.courseId));
  const toPay = cart.items.filter((item) => !ownedIds.has(item.id));
  const total = toPay.reduce((sum, item) => sum + item.price, 0);
  const oldTotal = toPay.reduce((sum, item) => sum + Math.max(item.oldPrice, item.price), 0);

  let body;
  if (isAdmin) {
    body = (
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Administrators see every course, so there is nothing to buy.
      </p>
    );
  } else if (cart.count === 0) {
    body = (
      <div data-testid="cart-empty" className={`${PANEL} max-w-md mx-auto p-8 text-center space-y-3`}>
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <ShoppingCart size={26} />
        </span>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Your cart is empty</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Open a course and press Add to Cart to buy several together.</p>
        <Link
          to="/demo#courses"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
        >
          Browse Courses
        </Link>
      </div>
    );
  } else {
    body = (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <section className={`${PANEL} lg:col-span-2 overflow-hidden`}>
          <h2 className="px-4 sm:px-5 pt-4 pb-3 text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
            {cart.count} {cart.count === 1 ? 'course' : 'courses'} in cart
          </h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} owned={ownedIds.has(item.id)} />
            ))}
          </ul>
        </section>

        <aside className={`${PANEL} p-5 space-y-4 lg:sticky lg:top-28`}>
          <div>
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total</div>
            <div data-testid="cart-total" className="text-3xl font-black text-slate-950 dark:text-white">
              {formatPrice(total)}
            </div>
            {oldTotal > total && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <span className="line-through">{formatPrice(oldTotal)}</span>{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {Math.round(((oldTotal - total) / oldTotal) * 100)}% off
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            data-testid="cart-checkout"
            onClick={() => navigate('/checkout')}
            disabled={toPay.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            You won't be charged yet. One payment covers every course here.
          </p>
        </aside>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-5">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/demo'))}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Keep Browsing</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">Shopping Cart</h1>
        {body}
      </div>
    </div>
  );
}
