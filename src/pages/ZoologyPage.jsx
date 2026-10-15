import React, { useEffect } from 'react';
import ZoologyHero from '../components/zoology/ZoologyHero';
import ZoologyWhyChooseUs from '../components/zoology/ZoologyWhyChooseUs';
import ZoologyCurriculum from '../components/zoology/ZoologyCurriculum';
import ZoologyRoadmapsGrid from '../components/zoology/ZoologyRoadmapsGrid';
import ZoologyTestimonials from '../components/zoology/ZoologyTestimonials';
import ZoologyStatsBar from '../components/zoology/ZoologyStatsBar';
import ZoologyPricingSection from '../components/zoology/ZoologyPricingSection';
import ZoologyFaqSection from '../components/zoology/ZoologyFaqSection';
import SubjectLabPracticalBanner from '../components/lab/SubjectLabPracticalBanner';

export default function ZoologyPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* Zoology Hero Section with 3D Interactive Zoology Book */}
      <ZoologyHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      <SubjectLabPracticalBanner 
        subjectId="zoo"
        subjectName="Zoology"
        practicalMarks="30 Marks"
      />

      {/* Why Choose Us Grid for Zoology */}
      <ZoologyWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Zoology Modules & Curriculum */}
      <ZoologyCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Zoology Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <ZoologyRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Zoology */}
      <ZoologyTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <ZoologyStatsBar />

      {/* Tuition Plans & Pricing for Zoology */}
      <ZoologyPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`Zoology Plan: ${planName}`)}
      />

      {/* Frequently Asked Questions */}
      <ZoologyFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
