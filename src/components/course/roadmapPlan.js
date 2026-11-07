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

// The numbers on the roadmap card, counted from its plan
export const countPlan = (plan) => {
  const counts = { modules: 0, tests: 0, notes: 0, videos: 0 };
  planDays(plan).forEach((day) =>
    (day.steps || []).forEach((step) => {
      counts.modules += 1;
      (step.resources || []).forEach((resource) => {
        if (resource.kind === 'video') counts.videos += 1;
        if (resource.kind === 'notes') counts.notes += 1;
        if (resource.kind === 'quiz') counts.tests += 1;
      });
    })
  );
  return counts;
};
