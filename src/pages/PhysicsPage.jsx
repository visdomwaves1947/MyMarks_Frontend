import React, { useEffect } from 'react';
import PhysicsHero from '../components/physics/PhysicsHero';
import PhysicsWhyChooseUs from '../components/physics/PhysicsWhyChooseUs';
import PhysicsCurriculum from '../components/physics/PhysicsCurriculum';
import PhysicsRoadmapsGrid from '../components/physics/PhysicsRoadmapsGrid';
import PhysicsTestimonials from '../components/physics/PhysicsTestimonials';
import PhysicsStatsBar from '../components/physics/PhysicsStatsBar';
import PhysicsFaqSection from '../components/physics/PhysicsFaqSection';
import SubjectLabPracticalBanner from '../components/lab/SubjectLabPracticalBanner';

export default function PhysicsPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      <PhysicsHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      <SubjectLabPracticalBanner 
        subjectId="phy"
        subjectName="Physics"
        practicalMarks="30 Marks"
      />

      <PhysicsWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      <PhysicsCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <PhysicsRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      <PhysicsTestimonials 
        onOpenBooking={onOpenBooking}
      />

      <PhysicsStatsBar />

      <PhysicsFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
