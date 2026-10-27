import React, { useEffect } from 'react';
import MathsHero from '../components/maths/MathsHero';
import MathsWhyChooseUs from '../components/maths/MathsWhyChooseUs';
import MathsCurriculum from '../components/maths/MathsCurriculum';
import MathsRoadmapsGrid from '../components/maths/MathsRoadmapsGrid';
import MathsTestimonials from '../components/maths/MathsTestimonials';
import MathsStatsBar from '../components/maths/MathsStatsBar';
import MathsPricingSection from '../components/maths/MathsPricingSection';
import MathsFaqSection from '../components/maths/MathsFaqSection';

export default function MathsPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap, currentUser }) {
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
      {/* Mathematics Hero Section with 3D Interactive Model */}
      <MathsHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for Mathematics */}
      <MathsWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Mathematics Modules & Curriculum */}
      <MathsCurriculum 
        currentUser={currentUser}
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Mathematics Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <MathsRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Mathematics */}
      <MathsTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <MathsStatsBar />

      {/* Tuition Plans & Pricing for Mathematics */}
      <MathsPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`Maths Plan: ${planName}`)}
      />

      {/* Frequently Asked Questions */}
      <MathsFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}