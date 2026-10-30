import React, { useEffect } from 'react';
import HindiHero from '../components/hindi/HindiHero';
import HindiWhyChooseUs from '../components/hindi/HindiWhyChooseUs';
import HindiCurriculum from '../components/hindi/HindiCurriculum';
import HindiRoadmapsGrid from '../components/hindi/HindiRoadmapsGrid';
import HindiTestimonials from '../components/hindi/HindiTestimonials';
import HindiStatsBar from '../components/hindi/HindiStatsBar';
import HindiFaqSection from '../components/hindi/HindiFaqSection';

export default function HindiPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* Hindi Hero Section with 3D Interactive Hindi Book */}
      <HindiHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for Hindi */}
      <HindiWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Hindi Modules & Curriculum */}
      <HindiCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Hindi Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <HindiRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Hindi */}
      <HindiTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <HindiStatsBar />

      {/* Frequently Asked Questions */}
      <HindiFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
