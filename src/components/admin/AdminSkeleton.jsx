import React from "react";

const BLOCK = "animate-pulse rounded-lg bg-slate-200/90 dark:bg-slate-800";
const PANEL =
  "rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none";

const times = (count) => Array.from({ length: count }, (_, index) => index);

// Rows with a thumbnail, two lines of text and an action area
export function SkeletonRows({ rows = 6, label }) {
  return (
    <div
      role={label ? "status" : undefined}
      aria-label={label}
      className={`${PANEL} overflow-hidden`}
    >
      {times(rows).map((row) => (
        <div
          key={row}
          className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800/70"
        >
          <div className={`${BLOCK} w-14 h-14 shrink-0`} />
          <div className="flex-1 min-w-0 space-y-2">
            <div className={`${BLOCK} h-3.5 w-2/5`} />
            <div className={`${BLOCK} h-3 w-3/5`} />
          </div>
          <div className={`${BLOCK} hidden sm:block h-7 w-24 shrink-0`} />
        </div>
      ))}
    </div>
  );
}

// Labels with input boxes, for the course editor
export function SkeletonForm({ fields = 5, label }) {
  return (
    <div
      role={label ? "status" : undefined}
      aria-label={label}
      className={`${PANEL} p-4 sm:p-5 space-y-5`}
    >
      {times(fields).map((field) => (
        <div key={field} className="space-y-2">
          <div className={`${BLOCK} h-3 w-28`} />
          <div className={`${BLOCK} h-10 w-full rounded-xl`} />
        </div>
      ))}
    </div>
  );
}

function SkeletonStats({ count }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {times(count).map((card) => (
        <div key={card} className={`${PANEL} p-5 space-y-3`}>
          <div className={`${BLOCK} h-3 w-3/4`} />
          <div className={`${BLOCK} h-7 w-1/2`} />
          <div className={`${BLOCK} h-3 w-2/3`} />
        </div>
      ))}
    </div>
  );
}

function SkeletonVideoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {times(6).map((card) => (
        <div key={card} className={`${PANEL} overflow-hidden`}>
          <div className="animate-pulse aspect-video bg-slate-200/90 dark:bg-slate-800" />
          <div className="p-4 space-y-2">
            <div className={`${BLOCK} h-3.5 w-4/5`} />
            <div className={`${BLOCK} h-3 w-1/2`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className={`${PANEL} p-4 flex items-center gap-3`}>
      <div className={`${BLOCK} h-10 flex-1 max-w-md rounded-xl`} />
      <div className={`${BLOCK} hidden sm:block h-10 w-32 rounded-xl`} />
    </div>
  );
}

/**
 * Stands in for a tab of the admin panel while its first data is loading
 */
export default function AdminTabSkeleton({ tab }) {
  // The Courses tab loads its own data, and Settings needs none
  if (!["dashboard", "students", "videos", "bookings"].includes(tab)) return null;

  return (
    <div role="status" aria-label="Loading admin data" className="space-y-5">
      {tab === "dashboard" && (
        <>
          <SkeletonStats count={5} />
          <SkeletonRows rows={5} />
        </>
      )}
      {tab === "students" && (
        <>
          <SkeletonBar />
          <SkeletonRows rows={7} />
        </>
      )}
      {tab === "videos" && (
        <>
          <SkeletonStats count={5} />
          <SkeletonBar />
          <SkeletonVideoGrid />
        </>
      )}
      {tab === "bookings" && (
        <>
          <SkeletonBar />
          <SkeletonRows rows={6} />
        </>
      )}
    </div>
  );
}
