import React, { useState } from 'react';
import { ArrowRight, Award, CheckCircle2, ChevronDown, HelpCircle, ShieldCheck, Star } from 'lucide-react';
import { courseImage, showDefaultImage } from '../../utils/courseImage';
import { hasPlan } from './roadmapPlan';

export function CourseWhyChoose({ data }) {
  if (!data?.items?.length) return null;

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {data.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="group bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {item.image && (
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={courseImage(item.image, 640)}
                    alt={item.title}
                    loading="lazy"
                    onError={showDefaultImage}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CourseRoadmaps({ data, theme, onSelectRoadmap }) {
  if (!data?.items?.length) return null;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] py-8 sm:py-16 border-t border-b border-slate-200 dark:border-slate-800">
      <section id="roadmaps" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {data.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {data.items.map((plan) => (
            <div
              key={plan.key || plan.title}
              data-testid="course-roadmap"
              className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${theme.soft}`}>
                  {plan.level}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${theme.accent}`}>
                  <ShieldCheck size={14} /> {plan.expectedScore}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 leading-relaxed">{plan.desc}</p>

              <div className="grid grid-cols-4 gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-6 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                {[
                  ['modules', 'Mods'],
                  ['tests', 'Tests'],
                  ['notes', 'Notes'],
                  ['videos', 'Vids'],
                ].map(([key, label]) => (
                  <div key={key}>
                    <span className={`block font-black ${theme.accent}`}>{plan.stats?.[key] ?? 0}</span>
                    {label}
                  </div>
                ))}
              </div>

              {hasPlan(plan) && (
                <button
                  onClick={() => onSelectRoadmap(plan)}
                  className={`w-full py-3 rounded-xl ${theme.solid} font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm`}
                >
                  <span>Select Roadmap</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CourseGuarantee({ data, theme }) {
  if (!data?.title) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] dark:bg-[#0B0F19] pb-8 sm:pb-16">
      <section className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-12 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${theme.solid}`}>
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            {data.badge && (
              <div className={`text-[11px] font-black tracking-widest uppercase mb-2 ${theme.accent}`}>{data.badge}</div>
            )}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">{data.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{data.text}</p>

            {data.points?.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 mb-6">
                {data.listTitle && (
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme.accent}`}>{data.listTitle}</h4>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                  {data.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={15} className={`shrink-0 ${theme.accent}`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.closing && (
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic mb-3">{data.closing}</p>
            )}
            {data.note && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.note}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CourseTestimonials({ data, theme }) {
  if (!data?.items?.length) return null;

  return (
    <section id="reviews" className="py-20 sm:py-24 bg-[#E5ECF4] dark:bg-[#0E1322] overflow-hidden border-t border-b border-[#CBD5E1] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {data.badge && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.soft} text-xs font-semibold uppercase tracking-wider mb-3`}>
              <Award size={14} />
              {data.badge}
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-base sm:text-lg">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((review) => (
            <div
              key={`${review.name}-${review.comment.slice(0, 20)}`}
              className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 mb-4">
                {review.image && (
                  <img
                    src={courseImage(review.image, 160)}
                    alt={review.name}
                    loading="lazy"
                    onError={showDefaultImage}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{review.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{review.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3 text-amber-400">
                {[...Array(review.rating || 5)].map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-4 italic">
                "{review.comment}"
              </p>

              <div className={`pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold flex items-center justify-between gap-2 ${theme.accent}`}>
                <span>{review.course}</span>
                {review.achievement && <span className={`px-2 py-0.5 rounded-md ${theme.soft}`}>{review.achievement}</span>}
              </div>
            </div>
          ))}
        </div>

        {data.stats?.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs"
              >
                <div className={`text-3xl sm:text-4xl font-black font-mono mb-1 ${theme.accent}`}>{stat.number}</div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CourseStats({ stats, theme }) {
  if (!stats?.length) return null;

  return (
    <section className="w-full bg-[#E5ECF4] dark:bg-[#0B0F19] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white dark:bg-[#131927] rounded-[24px] shadow-sm border border-slate-200/50 dark:border-slate-800 py-8 sm:py-10 px-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center">
                <span className={`text-3xl sm:text-4xl font-black tracking-tight mb-2 ${theme.accent}`}>{stat.number}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CourseFaqs({ data, theme }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!data?.items?.length) return null;

  return (
    <section id="faq" className="py-20 sm:py-24 relative bg-[#E5ECF4] dark:bg-[#0E1322] border-t border-b border-[#CBD5E1] dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          {data.badge && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.soft} text-xs font-semibold uppercase tracking-wider mb-3`}>
              <HelpCircle size={14} />
              {data.badge}
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{data.heading}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-base">{data.subheading}</p>
        </div>

        <div className="space-y-3.5">
          {data.items.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.q}
                className="bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] rounded-xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-white transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/40 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
