import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, CheckCircle2, Copy, ListChecks, Plus, Save, Send, Trash2, X } from 'lucide-react';
import useDialog from '../../../hooks/useDialog';
import { createAssignment, updateAssignment } from '../../../services/assignmentsApi';

const INPUT =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40';
const LABEL = 'block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1';
const ICON_BUTTON =
  'p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const MAX_QUESTIONS = 100;

let nextKey = 0;
const newKey = () => {
  nextKey += 1;
  return `q${nextKey}`;
};
const blankQuestion = () => ({ key: newKey(), text: '', options: ['', '', '', ''], answer: null, explanation: '' });
const fromSaved = (question) => ({
  key: newKey(),
  _id: question._id,
  text: question.text,
  options: [...question.options],
  answer: question.answer,
  explanation: question.explanation || '',
});

// The first thing wrong with the questions, as the server would say it, so it is caught before saving
const problemIn = (questions) => {
  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const place = `Question ${index + 1}`;
    const options = question.options.map((option) => option.trim());
    if (!question.text.trim()) return { index, message: `${place}: type the question.` };
    if (options.some((option) => !option)) return { index, message: `${place}: an answer is empty. Type it or remove it.` };
    if (new Set(options.map((option) => option.toLowerCase())).size !== options.length) return { index, message: `${place}: two answers are the same.` };
    if (question.answer === null) return { index, message: `${place}: mark which answer is the right one.` };
  }
  return null;
};

/**
 * Admin: the assignment of one chapter. Its title and pass mark, and its questions: each with
 * two to six answers, the right one marked, and an explanation the student sees after answering.
 */
export default function AssignmentEditor({ course, chapter, assignment, onClose, onSaved, showToast }) {
  const { confirm } = useDialog();
  const [title, setTitle] = useState(assignment?.title || `${chapter.name} test`.slice(0, 120));
  const [instructions, setInstructions] = useState(assignment?.instructions || '');
  const [passPercent, setPassPercent] = useState(String(assignment?.passPercent ?? 40));
  const [questions, setQuestions] = useState(() => (assignment?.questions?.length ? assignment.questions.map(fromSaved) : [blankQuestion()]));
  const [saved, setSaved] = useState(assignment);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState('');
  const [problem, setProblem] = useState(null);
  const cards = useRef(new Map());
  const scroller = useRef(null);
  const published = saved?.status === 'published';

  useEffect(() => {
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = before;
    };
  }, []);

  const touch = () => {
    setChanged(true);
    setProblem(null);
  };
  const editQuestion = (key, change) => {
    setQuestions((list) => list.map((question) => (question.key === key ? { ...question, ...change } : question)));
    touch();
  };
  const showQuestion = (key) =>
    requestAnimationFrame(() => {
      const card = cards.current.get(key);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card?.querySelector('textarea')?.focus({ preventScroll: true });
    });

  const addQuestion = () => {
    const question = blankQuestion();
    setQuestions((list) => [...list, question]);
    touch();
    showQuestion(question.key);
  };
  const copyQuestion = (index) => {
    const copy = { ...questions[index], key: newKey(), _id: undefined, options: [...questions[index].options] };
    setQuestions((list) => [...list.slice(0, index + 1), copy, ...list.slice(index + 1)]);
    touch();
    showQuestion(copy.key);
  };
  const removeQuestion = async (index) => {
    const question = questions[index];
    const typed = question.text.trim() || question.options.some((option) => option.trim());
    if (typed && !(await confirm({ title: `Delete question ${index + 1}?`, message: 'The question and its answers are removed.', confirmLabel: 'Delete', tone: 'danger' }))) {
      return;
    }
    setQuestions((list) => list.filter((item) => item.key !== question.key));
    touch();
  };
  const moveQuestion = (index, step) => {
    setQuestions((list) => {
      const next = [...list];
      [next[index], next[index + step]] = [next[index + step], next[index]];
      return next;
    });
    touch();
  };

  const editOption = (question, place, value) =>
    editQuestion(question.key, { options: question.options.map((option, index) => (index === place ? value : option)) });
  const addOption = (question) => editQuestion(question.key, { options: [...question.options, ''] });
  const removeOption = (question, place) => {
    // The right answer stays the same answer after one above it is removed
    let { answer } = question;
    if (answer === place) answer = null;
    else if (answer !== null && answer > place) answer -= 1;
    editQuestion(question.key, { options: question.options.filter((_, index) => index !== place), answer });
  };

  const save = async (status) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setProblem({ message: 'Give the assignment a title, such as "Chapter 1 test".' });
      scroller.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const pass = Number(passPercent);
    if (passPercent.trim() === '' || !Number.isFinite(pass) || pass < 0 || pass > 100) {
      setProblem({ message: 'The pass mark must be between 0 and 100 percent.' });
      scroller.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // A question left completely empty is not saved
    const kept = questions.filter((question) => question.text.trim() || question.options.some((option) => option.trim()));
    const wrong = problemIn(kept);
    if (wrong) {
      setProblem(wrong);
      cards.current.get(kept[wrong.index].key)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (status === 'published' && kept.length === 0) {
      setProblem({ message: 'Add at least one question before publishing.' });
      return;
    }
    const body = {
      title: cleanTitle,
      instructions: instructions.trim(),
      passPercent: Math.round(pass),
      status,
      chapterName: chapter.name,
      questions: kept.map((question) => ({
        ...(question._id ? { _id: question._id } : {}),
        text: question.text.trim(),
        options: question.options.map((option) => option.trim()),
        answer: question.answer,
        explanation: question.explanation.trim(),
      })),
    };
    setSaving(status);
    try {
      const result = saved
        ? await updateAssignment(saved._id, body)
        : await createAssignment({ ...body, courseId: course._id, chapterKey: chapter.key });
      setSaved(result);
      setQuestions(result.questions.length ? result.questions.map(fromSaved) : [blankQuestion()]);
      setChanged(false);
      setProblem(null);
      onSaved(result);
      showToast?.(status === 'published' ? 'Assignment published. Students can take it now.' : 'Assignment saved as a draft.', 'success');
    } catch (error) {
      setProblem({ message: error.message || 'Could not save the assignment.' });
    } finally {
      setSaving('');
    }
  };

  const close = async () => {
    if (changed && !(await confirm({ title: 'Close without saving?', message: 'The changes you made are lost.', confirmLabel: 'Close', tone: 'danger' }))) {
      return;
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Assignment of ${chapter.name}`}
        data-testid="assignment-editor"
        className="flex h-full w-full max-w-4xl flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 sm:rounded-3xl shadow-2xl"
      >
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300">
            <ListChecks size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black text-slate-950 dark:text-white">{chapter.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {course.name} · Assignment ·{' '}
              <span data-testid="assignment-editor-status" className={`font-bold ${published ? 'text-emerald-600' : 'text-amber-600'}`}>
                {!saved ? 'Not saved yet' : published ? 'Published' : 'Draft'}
              </span>
              {changed ? ' · Unsaved changes' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="assignment-save-draft"
              disabled={Boolean(saving)}
              onClick={() => save('draft')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving === 'draft' ? 'Saving...' : published ? 'Unpublish (draft)' : 'Save draft'}</span>
            </button>
            <button
              type="button"
              data-testid="assignment-publish"
              disabled={Boolean(saving)}
              onClick={() => save('published')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={15} />
              <span>{saving === 'published' ? 'Saving...' : published ? 'Save changes' : 'Publish'}</span>
            </button>
            <button type="button" onClick={close} aria-label="Close" className={ICON_BUTTON}>
              <X size={18} />
            </button>
          </div>
        </header>

        <div ref={scroller} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          {problem && (
            <p role="alert" data-testid="assignment-problem" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {problem.message}
            </p>
          )}

          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className={LABEL} htmlFor="assignment-title">
                Title
              </label>
              <input
                id="assignment-title"
                data-testid="assignment-title"
                className={INPUT}
                value={title}
                maxLength={120}
                onChange={(event) => {
                  setTitle(event.target.value);
                  touch();
                }}
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="assignment-pass">
                Pass mark (%)
              </label>
              <input
                id="assignment-pass"
                data-testid="assignment-pass"
                className={INPUT}
                type="number"
                min={0}
                max={100}
                value={passPercent}
                onChange={(event) => {
                  setPassPercent(event.target.value);
                  touch();
                }}
              />
            </div>
            <div className="sm:col-span-4">
              <label className={LABEL} htmlFor="assignment-instructions">
                Instructions for the student (optional)
              </label>
              <textarea
                id="assignment-instructions"
                className={`${INPUT} min-h-[60px]`}
                value={instructions}
                maxLength={1000}
                placeholder="For example: Choose the best answer. You can try as many times as you like."
                onChange={(event) => {
                  setInstructions(event.target.value);
                  touch();
                }}
              />
            </div>
          </section>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-950 dark:text-white">
              Questions <span data-testid="question-count" className="font-semibold text-slate-500">({questions.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tick the circle beside the right answer.</p>
          </div>

          {questions.map((question, index) => (
            <section
              key={question.key}
              ref={(element) => {
                if (element) cards.current.set(question.key, element);
                else cards.current.delete(question.key);
              }}
              data-testid="question-card"
              className={`rounded-2xl border bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-3 ${
                problem?.index === index ? 'border-rose-400 ring-2 ring-rose-200 dark:ring-rose-900' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-slate-950 dark:text-white">Question {index + 1}</p>
                <div className="flex items-center gap-0.5">
                  <button type="button" className={ICON_BUTTON} aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => moveQuestion(index, -1)}>
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={`Move question ${index + 1} down`}
                    disabled={index === questions.length - 1}
                    onClick={() => moveQuestion(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    className={ICON_BUTTON}
                    aria-label={`Copy question ${index + 1}`}
                    disabled={questions.length >= MAX_QUESTIONS}
                    onClick={() => copyQuestion(index)}
                  >
                    <Copy size={15} />
                  </button>
                  <button type="button" className={`${ICON_BUTTON} hover:text-rose-600`} aria-label={`Delete question ${index + 1}`} onClick={() => removeQuestion(index)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <textarea
                data-testid="question-text"
                aria-label={`Question ${index + 1}`}
                className={`${INPUT} min-h-[64px]`}
                value={question.text}
                maxLength={2000}
                placeholder="Type the question"
                onChange={(event) => editQuestion(question.key, { text: event.target.value })}
              />

              <div role="radiogroup" aria-label={`Right answer of question ${index + 1}`} className="space-y-2">
                {question.options.map((option, place) => {
                  const right = question.answer === place;
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={place} data-testid="option-row" className="flex items-center gap-2">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={right}
                        aria-label={`Answer ${LETTERS[place]} is the right answer`}
                        data-testid="option-correct"
                        onClick={() => editQuestion(question.key, { answer: place })}
                        className={`h-8 w-8 shrink-0 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                          right
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-400 hover:text-emerald-400'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <span className="w-5 shrink-0 text-center text-xs font-black text-slate-500 dark:text-slate-400">{LETTERS[place]}</span>
                      <input
                        data-testid="option-input"
                        aria-label={`Question ${index + 1}, answer ${LETTERS[place]}`}
                        className={`${INPUT} ${right ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30' : ''}`}
                        value={option}
                        maxLength={500}
                        placeholder={`Answer ${LETTERS[place]}`}
                        onChange={(event) => editOption(question, place, event.target.value)}
                      />
                      <button
                        type="button"
                        className={`${ICON_BUTTON} hover:text-rose-600`}
                        aria-label={`Remove answer ${LETTERS[place]} of question ${index + 1}`}
                        disabled={question.options.length <= MIN_OPTIONS}
                        onClick={() => removeOption(question, place)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  );
                })}
                {question.options.length < MAX_OPTIONS && (
                  <button
                    type="button"
                    data-testid="add-option"
                    onClick={() => addOption(question)}
                    className="ml-[3.75rem] text-xs font-bold text-blue-600 dark:text-cyan-400 inline-flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Plus size={13} />
                    <span>Add an answer</span>
                  </button>
                )}
              </div>

              <div>
                <label className={LABEL} htmlFor={`explanation-${question.key}`}>
                  Explanation (shown after the student answers, optional)
                </label>
                <textarea
                  id={`explanation-${question.key}`}
                  data-testid="question-explanation"
                  className={`${INPUT} min-h-[48px]`}
                  value={question.explanation}
                  maxLength={2000}
                  placeholder="Why the right answer is right"
                  onChange={(event) => editQuestion(question.key, { explanation: event.target.value })}
                />
              </div>
            </section>
          ))}

          <button
            type="button"
            data-testid="add-question"
            disabled={questions.length >= MAX_QUESTIONS}
            onClick={addQuestion}
            className="w-full rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Plus size={16} />
            <span>Add a question</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
