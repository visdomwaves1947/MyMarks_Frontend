import React, { useEffect } from 'react';
import AboutUs from '../components/AboutUs';

export default function AboutUsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Standalone About Us section with unified full-page background */}
      <AboutUs />
    </div>
  );
}
