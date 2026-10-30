import React, { useEffect } from 'react';
import SanskritHero from '../components/sanskrit/SanskritHero';
import SanskritWhyChooseUs from '../components/sanskrit/SanskritWhyChooseUs';
import SanskritCurriculum from '../components/sanskrit/SanskritCurriculum';
import SanskritRoadmapsGrid from '../components/sanskrit/SanskritRoadmapsGrid';
import SanskritTestimonials from '../components/sanskrit/SanskritTestimonials';
import SanskritStatsBar from '../components/sanskrit/SanskritStatsBar';
import SanskritFaqSection from '../components/sanskrit/SanskritFaqSection';

export default function SanskritPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <SanskritHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      <SanskritWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      <SanskritCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <SanskritRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      <SanskritTestimonials 
        onOpenBooking={onOpenBooking}
      />

      <SanskritStatsBar />

      <SanskritFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
