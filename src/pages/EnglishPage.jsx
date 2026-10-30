import React, { useEffect } from 'react';
import EnglishHero from '../components/english/EnglishHero';
import EnglishWhyChooseUs from '../components/english/EnglishWhyChooseUs';
import EnglishCurriculum from '../components/english/EnglishCurriculum';
import EnglishRoadmapsGrid from '../components/english/EnglishRoadmapsGrid';
import EnglishTestimonials from '../components/english/EnglishTestimonials';
import EnglishStatsBar from '../components/english/EnglishStatsBar';
import EnglishFaqSection from '../components/english/EnglishFaqSection';

export default function EnglishPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* English Hero Section with 3D Interactive English Book */}
      <EnglishHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for English */}
      <EnglishWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate English Modules & Curriculum */}
      <EnglishCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium English Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <EnglishRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for English */}
      <EnglishTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <EnglishStatsBar />

      {/* Frequently Asked Questions */}
      <EnglishFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
