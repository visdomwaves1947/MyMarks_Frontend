import React, { useEffect } from 'react';
import HistoryHero from '../components/history/HistoryHero';
import HistoryWhyChooseUs from '../components/history/HistoryWhyChooseUs';
import HistoryCurriculum from '../components/history/HistoryCurriculum';
import HistoryRoadmapsGrid from '../components/history/HistoryRoadmapsGrid';
import HistoryTestimonials from '../components/history/HistoryTestimonials';
import HistoryStatsBar from '../components/history/HistoryStatsBar';
import HistoryPricingSection from '../components/history/HistoryPricingSection';
import HistoryFaqSection from '../components/history/HistoryFaqSection';

export default function HistoryPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <HistoryHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo} 
      />
      <HistoryWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />
      <HistoryCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)} 
      />
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <HistoryRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>
      <HistoryTestimonials 
        onOpenBooking={onOpenBooking} 
      />
      <HistoryStatsBar />
      <HistoryPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`History Plan: ${planName}`)} 
      />
      <HistoryFaqSection 
        onOpenBooking={onOpenBooking} 
      />
    </>
  );
}
