import React, { useEffect } from 'react';
import CivicsHero from '../components/civics/CivicsHero';
import CivicsWhyChooseUs from '../components/civics/CivicsWhyChooseUs';
import CivicsCurriculum from '../components/civics/CivicsCurriculum';
import CivicsRoadmapsGrid from '../components/civics/CivicsRoadmapsGrid';
import CivicsTestimonials from '../components/civics/CivicsTestimonials';
import CivicsStatsBar from '../components/civics/CivicsStatsBar';
import CivicsFaqSection from '../components/civics/CivicsFaqSection';

export default function CivicsPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <CivicsHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo} 
      />
      <CivicsWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />
      <CivicsCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)} 
      />
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <CivicsRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>
      <CivicsTestimonials 
        onOpenBooking={onOpenBooking} 
      />
      <CivicsStatsBar />
      <CivicsFaqSection 
        onOpenBooking={onOpenBooking} 
      />
    </>
  );
}
