import React, { useEffect } from 'react';
import TeluguHero from '../components/telugu/TeluguHero';
import TeluguWhyChooseUs from '../components/telugu/TeluguWhyChooseUs';
import TeluguCurriculum from '../components/telugu/TeluguCurriculum';
import TeluguRoadmapsGrid from '../components/telugu/TeluguRoadmapsGrid';
import TeluguTestimonials from '../components/telugu/TeluguTestimonials';
import TeluguStatsBar from '../components/telugu/TeluguStatsBar';
import TeluguFaqSection from '../components/telugu/TeluguFaqSection';

export default function TeluguPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* Telugu Hero Section with 3D Interactive Telugu Book */}
      <TeluguHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for Telugu */}
      <TeluguWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Telugu Modules & Curriculum */}
      <TeluguCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Telugu Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <TeluguRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Telugu */}
      <TeluguTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <TeluguStatsBar />

      {/* Frequently Asked Questions */}
      <TeluguFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
