import React, { useEffect } from 'react';
import UrduHero from '../components/urdu/UrduHero';
import UrduWhyChooseUs from '../components/urdu/UrduWhyChooseUs';
import UrduCurriculum from '../components/urdu/UrduCurriculum';
import UrduRoadmapsGrid from '../components/urdu/UrduRoadmapsGrid';
import UrduTestimonials from '../components/urdu/UrduTestimonials';
import UrduStatsBar from '../components/urdu/UrduStatsBar';
import UrduFaqSection from '../components/urdu/UrduFaqSection';

export default function UrduPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* Urdu Hero Section with 3D Interactive Urdu Book */}
      <UrduHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      {/* Why Choose Us Grid for Urdu */}
      <UrduWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Urdu Modules & Curriculum */}
      <UrduCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Urdu Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <UrduRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Urdu */}
      <UrduTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <UrduStatsBar />

      {/* Frequently Asked Questions */}
      <UrduFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
