import React, { useEffect } from 'react';
import ChemistryHero from '../components/chemistry/ChemistryHero';
import ChemistryWhyChooseUs from '../components/chemistry/ChemistryWhyChooseUs';
import ChemistryCurriculum from '../components/chemistry/ChemistryCurriculum';
import ChemistryRoadmapsGrid from '../components/chemistry/ChemistryRoadmapsGrid';
import ChemistryTestimonials from '../components/chemistry/ChemistryTestimonials';
import ChemistryStatsBar from '../components/chemistry/ChemistryStatsBar';
import ChemistryPricingSection from '../components/chemistry/ChemistryPricingSection';
import ChemistryFaqSection from '../components/chemistry/ChemistryFaqSection';
import SubjectLabPracticalBanner from '../components/lab/SubjectLabPracticalBanner';

export default function ChemistryPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <ChemistryHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      <SubjectLabPracticalBanner 
        subjectId="chem"
        subjectName="Chemistry"
        practicalMarks="30 Marks"
      />

      <ChemistryWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      <ChemistryCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <ChemistryRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      <ChemistryTestimonials 
        onOpenBooking={onOpenBooking}
      />

      <ChemistryStatsBar />

      <ChemistryPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`Chemistry Plan: ${planName}`)}
      />

      <ChemistryFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
