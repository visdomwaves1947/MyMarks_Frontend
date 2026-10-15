import React, { useEffect } from 'react';
import BotanyHero from '../components/botany/BotanyHero';
import BotanyWhyChooseUs from '../components/botany/BotanyWhyChooseUs';
import BotanyCurriculum from '../components/botany/BotanyCurriculum';
import BotanyRoadmapsGrid from '../components/botany/BotanyRoadmapsGrid';
import BotanyTestimonials from '../components/botany/BotanyTestimonials';
import BotanyStatsBar from '../components/botany/BotanyStatsBar';
import BotanyPricingSection from '../components/botany/BotanyPricingSection';
import BotanyFaqSection from '../components/botany/BotanyFaqSection';
import SubjectLabPracticalBanner from '../components/lab/SubjectLabPracticalBanner';

export default function BotanyPage({ onOpenBooking, onOpenVideoDemo, onSelectRoadmap }) {
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
      {/* Botany Hero Section with 3D Interactive Botany Book */}
      <BotanyHero 
        onOpenBooking={onOpenBooking} 
        onOpenVideoDemo={onOpenVideoDemo}
      />

      <SubjectLabPracticalBanner 
        subjectId="bot"
        subjectName="Botany"
        practicalMarks="30 Marks"
      />

      {/* Why Choose Us Grid for Botany */}
      <BotanyWhyChooseUs 
        onOpenBooking={onOpenBooking} 
      />

      {/* AP/TS Intermediate Botany Modules & Curriculum */}
      <BotanyCurriculum 
        onEnroll={(subjectName) => onOpenBooking(`Enroll in ${subjectName}`)}
      />

      {/* Premium Botany Roadmaps Grid */}
      <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
        <BotanyRoadmapsGrid 
          onSelectPlan={onSelectRoadmap} 
        />
      </div>

      {/* Student Results & Parent Testimonials for Botany */}
      <BotanyTestimonials 
        onOpenBooking={onOpenBooking}
      />

      {/* Stats Bar under Testimonials */}
      <BotanyStatsBar />

      {/* Tuition Plans & Pricing for Botany */}
      <BotanyPricingSection 
        onOpenBooking={(planName) => onOpenBooking(`Botany Plan: ${planName}`)}
      />

      {/* Frequently Asked Questions */}
      <BotanyFaqSection 
        onOpenBooking={onOpenBooking}
      />
    </>
  );
}
