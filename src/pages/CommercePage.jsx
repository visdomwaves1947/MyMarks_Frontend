import React, { useEffect } from 'react';
import CommerceHero from '../components/commerce/CommerceHero';
import CommerceWhyChooseUs from '../components/commerce/CommerceWhyChooseUs';
import CommerceCurriculum from '../components/commerce/CommerceCurriculum';
import CommerceRoadmapsGrid from '../components/commerce/CommerceRoadmapsGrid';
import CommerceTestimonials from '../components/commerce/CommerceTestimonials';
import CommerceStatsBar from '../components/commerce/CommerceStatsBar';
import CommerceFaqSection from '../components/commerce/CommerceFaqSection';

export default function CommercePage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <CommerceHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo} 
      />
      <CommerceWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />
      <CommerceCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)} 
      />
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <CommerceRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>
      <CommerceTestimonials 
        onOpenBooking={onOpenBooking} 
      />
      <CommerceStatsBar />
      <CommerceFaqSection 
        onOpenBooking={onOpenBooking} 
      />
    </>
  );
}
