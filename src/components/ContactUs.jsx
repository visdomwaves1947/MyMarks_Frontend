import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  User,
  BookOpen,
} from 'lucide-react';

export default function ContactUs({ onOpenBooking }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    stream: 'MPC',
    year: '1st Year',
    inquiryType: 'Academic Guidance',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const inquiryTypes = [
    'Academic Guidance',
    'Free Demo Class',
    'AP / TS Board Syllabus',
    'Enrollment & Fees',
    'Technical Support',
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate lightweight API submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      stream: 'MPC',
      year: '1st Year',
      inquiryType: 'Academic Guidance',
      message: '',
    });
  };

  const faqs = [
    {
      q: 'How quickly will an academic mentor get in touch with me?',
      a: 'Our student advisory team typically responds within 15 to 30 minutes during standard working hours (9:00 AM – 7:00 PM IST). Inquiries received after hours are answered early the following morning.',
    },
    {
      q: 'Can I request a personalized 1-on-1 demo session before enrolling?',
      a: 'Yes, absolutely! We offer free 1-on-1 video demo sessions where our faculty demonstrates our visual problem-solving approach and curriculum structure.',
    },
    {
      q: 'Do you offer guidance in both English and regional mediums?',
      a: 'Yes, our subject experts and mentors provide explanations in English, Telugu, Hindi, and Urdu to ensure students understand core concepts without language friction.',
    },
    {
      q: 'How can parents track intermediate exam preparations and scores?',
      a: 'Parents receive regular WhatsApp summary reports after every chapter assessment and full-length mock examination.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fefce8] dark:bg-[#151403] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sleek Minimal Header with light font weight & single starting line */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-b from-[#fef9c3]/70 via-[#fefce8] to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge with single line indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] font-normal text-emerald-700 dark:text-emerald-300 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Advisory desk online • Average response within 15 minutes</span>
          </div>

          {/* Heading with light, refined font weight */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
            Get in touch with our team
          </h1>

          {/* Single starting line text */}
          <p className="text-base sm:text-lg font-normal text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about intermediate syllabus, exam blueprints, or course enrollment? Reach out to our academic advisors anytime.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Contact Method Cards: 4 Clean Minimal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: Direct Call */}
          <div className="p-5 rounded-2xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center mb-3 shadow-xs">
                <Phone size={17} strokeWidth={1.75} />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-blue-900 dark:text-sky-300 mb-1">
                Direct Helpline
              </h3>
              <div className="text-base font-bold text-slate-950 dark:text-white mb-1">
                +91 79977 55155
              </div>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200 leading-snug">
                Speak directly with an academic mentor during active college hours.
              </p>
            </div>
            <a
              href="tel:+917997755155"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 hover:underline"
            >
              <span>Call counselor</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="p-5 rounded-2xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-xs">
                <MessageSquare size={17} strokeWidth={1.75} />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-blue-900 dark:text-sky-300 mb-1">
                WhatsApp Desk
              </h3>
              <div className="text-base font-bold text-slate-950 dark:text-white mb-1">
                +91 79977 55155
              </div>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200 leading-snug">
                Quick answers on syllabus topics, timetable, and study material.
              </p>
            </div>
            <a
              href="https://wa.me/917997755155?text=Hello%20MyMarks%20Team,%20I%20have%20an%20inquiry%20regarding%20intermediate%20courses."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:underline"
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="p-5 rounded-2xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-xs">
                <Mail size={17} strokeWidth={1.75} />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-blue-900 dark:text-sky-300 mb-1">
                Email Inquiries
              </h3>
              <div className="text-base font-bold text-slate-950 dark:text-white mb-1 truncate">
                info@visdomwaves.com
              </div>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200 leading-snug">
                For detailed questions, college tie-ups, and institutional queries.
              </p>
            </div>
            <a
              href="mailto:info@visdomwaves.com"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300 hover:underline"
            >
              <span>Send an email</span>
              <ArrowRight size={13} />
            </a>
          </div>

          {/* Card 4: Location & Hours */}
          <div className="p-5 rounded-2xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-white/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 shadow-xs">
                <MapPin size={17} strokeWidth={1.75} />
              </div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-blue-900 dark:text-sky-300 mb-1">
                Office Location
              </h3>
              <div className="text-base font-bold text-slate-950 dark:text-white mb-1">
                Hyderabad, Telangana
              </div>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200 leading-snug">
                Mon – Sat: 9:00 AM – 7:00 PM IST. Sunday by appointment.
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Clock size={13} />
              <span>India Standard Time</span>
            </span>
          </div>
        </div>

        {/* Two-Column Form & Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context, Advisory Highlights & Free Class Callout (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-sky-300 uppercase tracking-wider mb-2">
                <Sparkles size={14} />
                <span>Academic Advisory Hub</span>
              </div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2 tracking-tight">
                Dedicated assistance for AP & TS Intermediate students
              </h2>
              <p className="text-xs font-normal text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                Whether you need chapter-wise weightage analysis, blueprint clarifications, or guidance choosing between MPC and BiPC roadmaps, our counselors are ready.
              </p>

              <div className="space-y-3.5 border-t border-sky-200 dark:border-sky-700/80 pt-5">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Tailored AP & TS State Board Guidance
                    </div>
                    <div className="text-[11px] font-normal text-slate-700 dark:text-slate-300">
                      Updated for current BIEAP and TSBIE academic year guidelines.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Multilingual Faculty Support
                    </div>
                    <div className="text-[11px] font-normal text-slate-700 dark:text-slate-300">
                      Clarify doubts in English, Telugu, Hindi, or Sanskrit anytime.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Zero Pressure Consultation
                    </div>
                    <div className="text-[11px] font-normal text-slate-700 dark:text-slate-300">
                      Objective academic review tailored to your career aspirations.
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Trial Class Banner Button */}
              {onOpenBooking && (
                <div className="mt-6 pt-5 border-t border-sky-200 dark:border-sky-700/80">
                  <button
                    onClick={() => onOpenBooking('Contact Consultation')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <BookOpen size={14} />
                    <span>Book a Free 1-on-1 Class</span>
                  </button>
                </div>
              )}
            </div>

            {/* Privacy pledge card */}
            <div className="p-4 rounded-2xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 flex items-center gap-3 text-slate-800 dark:text-slate-200 shadow-sm">
              <ShieldCheck size={20} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
              <p className="text-[11px] font-medium leading-normal">
                Your contact details are strictly confidential. We never share phone numbers or send promotional spam.
              </p>
            </div>
          </div>

          {/* Right Column: Sleek Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#cde4fd] dark:bg-[#0d2238] border-2 border-sky-300 dark:border-sky-600 shadow-md relative">
              {submitted ? (
                /* Success Feedback State */
                <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-700 shadow-sm">
                    <CheckCircle2 size={30} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs font-normal text-slate-700 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you, <strong className="font-bold text-slate-900 dark:text-white">{formData.name}</strong>. An academic counselor will contact you at <strong className="font-bold text-slate-900 dark:text-white">{formData.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-sky-200 dark:border-sky-700"
                  >
                    <span>Submit another question</span>
                  </button>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-1">
                      Send a message
                    </h3>
                    <p className="text-xs font-normal text-slate-700 dark:text-slate-300">
                      Fill out your details below and our counseling faculty will connect with you.
                    </p>
                  </div>

                  {/* Inquiry Category Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-2">
                      Topic of Interest
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('inquiryType', type)}
                          className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                            formData.inquiryType === type
                              ? 'bg-blue-600 text-white shadow-xs font-bold'
                              : 'bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-white border border-sky-200/80 dark:border-sky-700 font-medium'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                        Your Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. S. Sai Krishna"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 98765 43210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Stream Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                        Intermediate Stream
                      </label>
                      <select
                        value={formData.stream}
                        onChange={(e) => handleInputChange('stream', e.target.value)}
                        className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs cursor-pointer"
                      >
                        <option value="MPC">MPC (Maths, Physics, Chem)</option>
                        <option value="BiPC">BiPC (Botany, Zoology, Chem, Phy)</option>
                        <option value="CEC">CEC (Commerce, Econ, Civics)</option>
                        <option value="MEC">MEC (Maths, Econ, Commerce)</option>
                        <option value="HEC">HEC (History, Economics, Civics)</option>
                        <option value="Other">Other / 10th Standard</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                        Academic Year
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs cursor-pointer"
                      >
                        <option value="1st Year">1st Year Intermediate</option>
                        <option value="2nd Year">2nd Year Intermediate</option>
                        <option value="Bridge / Repeater">Bridge / Repeater</option>
                      </select>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                      Your Question or Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you'd like guidance with (e.g., Mathematics calculus blueprint, Sanskrit notes, demo scheduling)..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-600 rounded-xl p-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y shadow-xs"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      {submitting ? (
                        <span>Sending inquiry...</span>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Submit Academic Inquiry</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] font-normal text-slate-600 dark:text-slate-400 text-center mt-2.5">
                      Single-line guarantee: Our faculty contacts students without promotional delays.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Minimal FAQ Section with Light Font Weights */}
        <div className="mt-16 pt-12 border-t border-amber-200/80 dark:border-amber-900/40 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs font-normal text-slate-700 dark:text-slate-300">
              Clear, straightforward answers about student counseling and support.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border-2 border-sky-300 dark:border-sky-600 bg-[#cde4fd] dark:bg-[#0d2238] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-3.5 px-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={15}
                      className={`text-slate-600 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs font-normal text-slate-700 dark:text-slate-200 leading-relaxed border-t border-sky-200 dark:border-sky-700/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
