import React from 'react';

const times = (count) => Array.from({ length: count }, (_, index) => index);

// A grey block with a light sweeping across it
function Bone({ className = '', round = 'rounded-lg' }) {
  return (
    <div className={`relative overflow-hidden bg-slate-300/80 dark:bg-slate-800 ${round} ${className}`}>
      <div className="absolute inset-0 animate-shimmer motion-reduce:hidden bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
    </div>
  );
}

/**
 * Stands in for a course page while it loads, in the shape of its hero and lessons
 */
export default function CourseSkeleton() {
  return (
    <div role="status" aria-label="Loading course" className="bg-[#EBF0F7] dark:bg-[#0B0F19]">
      <span className="sr-only">Loading course...</span>

      <section className="pt-8 pb-14 sm:pb-16 lg:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
            <div className="flex gap-2 mb-4">
              <Bone className="h-6 w-24" round="rounded-full" />
              <Bone className="h-6 w-20" round="rounded-full" />
            </div>

            <Bone className="h-9 sm:h-12 w-4/5 mb-3" />
            <Bone className="h-9 sm:h-12 w-3/5 mb-5" />
            <Bone className="h-4 w-full max-w-xl mb-2" />
            <Bone className="h-4 w-3/4 max-w-md mb-6" />

            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mb-7">
              <Bone className="h-12 w-full sm:w-40" round="rounded-xl" />
              <Bone className="h-12 w-full sm:w-44" round="rounded-xl" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
              {times(2).map((card) => (
                <Bone key={card} className="h-[72px]" round="rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <Bone className="w-64 h-84 sm:w-72 sm:h-96" round="rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-10 sm:mb-14">
            <Bone className="h-9 sm:h-11 w-64 sm:w-96 max-w-full mb-4" />
            <Bone className="h-4 w-72 sm:w-[28rem] max-w-full" />
          </div>

          <div className="space-y-3">
            {times(4).map((row) => (
              <div
                key={row}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
              >
                <Bone className="w-10 h-10 shrink-0" round="rounded-xl" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Bone className="h-4 w-2/5" />
                  <Bone className="h-3 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
