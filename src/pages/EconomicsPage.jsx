import React, { useEffect } from 'react';
import EconomicsHero from '../components/economics/EconomicsHero';
import EconomicsWhyChooseUs from '../components/economics/EconomicsWhyChooseUs';
import EconomicsCurriculum from '../components/economics/EconomicsCurriculum';
import EconomicsRoadmapsGrid from '../components/economics/EconomicsRoadmapsGrid';
import EconomicsTestimonials from '../components/economics/EconomicsTestimonials';
import EconomicsStatsBar from '../components/economics/EconomicsStatsBar';
import EconomicsPricingSection from '../components/economics/EconomicsPricingSection';
import EconomicsFaqSection from '../components/economics/EconomicsFaqSection';

export default function EconomicsPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <EconomicsHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo} 
      />
      <EconomicsWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />
      <EconomicsCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)} 
      />
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <EconomicsRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>
      <EconomicsTestimonials 
        onOpenBooking={onOpenBooking} 
      />
      <EconomicsStatsBar />
      <EconomicsPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`Economics Plan: ${planName}`)} 
      />
      <EconomicsFaqSection 
        onOpenBooking={onOpenBooking} 
      />
    </>
  );
}
