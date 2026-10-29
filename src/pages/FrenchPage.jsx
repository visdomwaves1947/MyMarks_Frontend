import React, { useEffect } from 'react';
import FrenchHero from '../components/french/FrenchHero';
import FrenchWhyChooseUs from '../components/french/FrenchWhyChooseUs';
import FrenchCurriculum from '../components/french/FrenchCurriculum';
import FrenchRoadmapsGrid from '../components/french/FrenchRoadmapsGrid';
import FrenchTestimonials from '../components/french/FrenchTestimonials';
import FrenchStatsBar from '../components/french/FrenchStatsBar';
import FrenchPricingSection from '../components/french/FrenchPricingSection';
import FrenchFaqSection from '../components/french/FrenchFaqSection';

export default function FrenchPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap, currentUser }) {
  // Handle hash scrolling if navigating with hash
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* French Hero Section with 3D Interactive French Book */}
      <FrenchHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for French */}
      <FrenchWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate French Modules & Curriculum */}
      <FrenchCurriculum 
        currentUser={currentUser}
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium French Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <FrenchRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for French */}
      <FrenchTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <FrenchStatsBar />

      {/* Tuition Plans & Pricing for French */}
      <FrenchPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`French Plan: ${planName}`)}
      />

      {/* Frequently Asked Questions */}
      <FrenchFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
