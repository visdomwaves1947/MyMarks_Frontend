import React, { useEffect } from 'react';
import ContactUs from '../components/ContactUs';

export default function ContactUsPage({ onOpenBooking }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <ContactUs onOpenBooking={onOpenBooking} />
    </div>
  );
}
