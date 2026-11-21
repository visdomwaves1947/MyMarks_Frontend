// Shared helpers for a course's study roadmaps: plans of days, steps and resources

export const RESOURCE_KINDS = [
  { value: 'video', label: 'Lesson video' },
  { value: 'notes', label: 'Notes link' },
  { value: 'quiz', label: 'Test link' },
  { value: 'tag', label: 'Tag' },
];

// Every plan as days. A plan from before days existed is one list of steps.
export const planDays = (plan) => {
  if (plan?.days?.length) return plan.days;
  const steps = plan?.steps || plan?.planSteps || [];
  return steps.length > 0 ? [{ title: '', desc: '', steps }] : [];
};

// A roadmap with no steps has no plan yet, so the website hides its button
export const hasPlan = (plan) => planDays(plan).some((day) => (day.steps || []).length > 0);

export const daysLabel = (count) => `${count} ${count === 1 ? 'Day' : 'Days'}`;

// ── Parts: a stretch of a lesson video with its summary. Roadmaps are made of these. ──

export const PART_MAX_SECONDS = 1800;

export const isPart = (resource) => resource?.kind === 'part';

const hasTimes = (resource) =>
  resource?.start !== null && resource?.start !== undefined && resource?.start !== '' &&
  resource?.end !== null && resource?.end !== undefined && resource?.end !== '' &&
  Number.isFinite(Number(resource.start)) && Number.isFinite(Number(resource.end));

// Times set and a summary written: students see it (the server keeps the same rule)
export const isFinishedPart = (resource) =>
  isPart(resource) && hasTimes(resource) && Number(resource.end) > Number(resource.start) && Boolean(String(resource.summary || '').trim());

export const partLength = (resource) => (hasTimes(resource) ? Math.max(0, Number(resource.end) - Number(resource.start)) : 0);

// The part of a step, when the step is one
export const partOf = (step) => (step?.resources || []).find(isPart) || null;

// "4 parts · 6 min"
export const partsSummary = (steps) => {
  const parts = (steps || []).map(partOf).filter(Boolean);
  const seconds = parts.reduce((sum, part) => sum + partLength(part), 0);
  const minutes = Math.round(seconds / 60);
  const time = seconds === 0 ? '' : seconds < 60 ? ` · ${Math.round(seconds)} sec` : ` · ${minutes} min`;
  return `${parts.length} ${parts.length === 1 ? 'part' : 'parts'}${time}`;
};

// The numbers on the roadmap card, counted from its plan
export const countPlan = (plan) => {
  const counts = { modules: 0, tests: 0, notes: 0, videos: 0 };
  planDays(plan).forEach((day) =>
    (day.steps || []).forEach((step) => {
      counts.modules += 1;
      (step.resources || []).forEach((resource) => {
        if (resource.kind === 'video' || resource.kind === 'part') counts.videos += 1;
        if (resource.kind === 'notes') counts.notes += 1;
        if (resource.kind === 'quiz') counts.tests += 1;
      });
    })
  );
  return counts;
};
