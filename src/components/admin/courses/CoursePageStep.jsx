import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ImageField from './ImageField';
import { Field, LinesField, PANEL_STYLE, RepeatList, TextArea, TextInput, Toggle } from './fields';

const THEME_COLORS = ['blue', 'indigo', 'purple', 'emerald', 'teal', 'amber', 'rose', 'orange', 'red'];

function Group({ title, sectionKey, sections, setSections, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const isShown = sectionKey ? sections?.[sectionKey] !== false : true;

  return (
    <div className={`${PANEL_STYLE} !p-0 overflow-hidden`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center gap-2 text-left font-bold text-slate-900 dark:text-white text-sm cursor-pointer"
        >
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          <span>{title}</span>
        </button>
        {sectionKey && (
          <Toggle
            label="Show"
            checked={isShown}
            onChange={(checked) => setSections({ ...sections, [sectionKey]: checked })}
          />
        )}
      </div>
      {isOpen && <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800/70 pt-3">{children}</div>}
    </div>
  );
}

function ImageLinkField({ label, value, onChange }) {
  return (
    <ImageField
      label={label}
      value={{ url: value || '' }}
      onChange={(image) => onChange(image.url)}
    />
  );
}

export default function CoursePageStep({ form, update }) {
  const page = form.page || {};
  const sections = form.sections || {};

  const setPage = (changes) => update({ page: { ...page, ...changes } });
  const setPart = (part, changes) => setPage({ [part]: { ...(page[part] || {}), ...changes } });
  const partField = (part, key) => ({
    value: page[part]?.[key],
    onChange: (value) => setPart(part, { [key]: value }),
  });

  const groupProps = { sections, setSections: (next) => update({ sections: next }) };

  return (
    <div className="space-y-3">
      <div className={PANEL_STYLE}>
        <Field label="Theme colour" hint="Used for the headings and buttons on this course page.">
          <div className="flex flex-wrap gap-2">
            {THEME_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-pressed={page.themeColor === color}
                onClick={() => setPage({ themeColor: color })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border cursor-pointer ${
                  (page.themeColor || 'blue') === color
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Group title="Hero" sectionKey="hero" {...groupProps}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Heading, first part" {...partField('hero', 'titleLead')} placeholder="e.g. Master Physics." />
          <TextInput label="Heading, coloured part" {...partField('hero', 'titleHighlight')} placeholder="e.g. Derive with Precision." />
        </div>
        <TextArea label="Subtitle" {...partField('hero', 'subtitle')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Main button" {...partField('hero', 'primaryLabel')} placeholder="e.g. Enroll Now" />
          <TextInput label="Second button" {...partField('hero', 'secondaryLabel')} placeholder="e.g. Explore Lessons" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Book badge" {...partField('hero', 'bookBadge')} />
          <TextInput label="Book score" {...partField('hero', 'bookScore')} placeholder="e.g. 60/60 Marks" />
          <TextInput label="Book title" {...partField('hero', 'bookTitle')} />
          <TextInput label="Book subtitle" {...partField('hero', 'bookSubtitle')} />
          <TextInput label="Book footer" {...partField('hero', 'bookFooter')} />
        </div>
        <Field label="Board cards">
          <RepeatList
            items={page.hero?.boards}
            onChange={(boards) => setPart('hero', { boards })}
            blank={{ code: '', title: '', subtitle: '' }}
            addLabel="Add Board Card"
            itemTitle={(item) => item.title}
            renderItem={(item, change) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TextInput label="Code" value={item.code} onChange={(code) => change({ code })} placeholder="AP" />
                <TextInput label="Title" value={item.title} onChange={(title) => change({ title })} />
                <TextInput label="Subtitle" value={item.subtitle} onChange={(subtitle) => change({ subtitle })} />
              </div>
            )}
          />
        </Field>
      </Group>

      <Group title="Practical Banner" sectionKey="practical" {...groupProps}>
        <TextInput
          label="Lab id"
          hint="The subject id in the lab practicals list, such as phy or chem."
          {...partField('practical', 'labId')}
        />
      </Group>

      <Group title="Why Choose Us" sectionKey="whyChoose" {...groupProps}>
        <TextInput label="Heading" {...partField('whyChoose', 'heading')} />
        <TextArea label="Subheading" rows={2} {...partField('whyChoose', 'subheading')} />
        <RepeatList
          items={page.whyChoose?.items}
          onChange={(items) => setPart('whyChoose', { items })}
          blank={{ title: '', subtitle: '', image: '' }}
          addLabel="Add Reason"
          itemTitle={(item) => item.title}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <TextInput label="Title" value={item.title} onChange={(title) => change({ title })} />
              <TextArea label="Text" rows={2} value={item.subtitle} onChange={(subtitle) => change({ subtitle })} />
              <ImageLinkField label="Image" value={item.image} onChange={(image) => change({ image })} />
            </div>
          )}
        />
      </Group>

      <Group title="Curriculum Heading" sectionKey="curriculum" {...groupProps}>
        <TextInput label="Badge" {...partField('curriculumIntro', 'badge')} />
        <TextInput label="Heading" {...partField('curriculumIntro', 'heading')} />
        <TextArea label="Subheading" rows={2} {...partField('curriculumIntro', 'subheading')} />
        <TextInput label="Notice title" {...partField('curriculumIntro', 'noticeTitle')} />
        <TextArea label="Notice text" rows={2} {...partField('curriculumIntro', 'noticeText')} />
        <TextInput label="Search box hint" {...partField('curriculumIntro', 'searchHint')} />
        <Field label="Syllabus modules">
          <RepeatList
            items={page.modules}
            onChange={(modules) => setPage({ modules })}
            blank={{ key: '', name: '', category: '', image: '', desc: '' }}
            addLabel="Add Module"
            itemTitle={(item) => item.name}
            renderItem={(item, change) => (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TextInput label="Name" value={item.name} onChange={(name) => change({ name })} />
                  <TextInput label="Category" value={item.category} onChange={(category) => change({ category })} />
                </div>
                <TextArea label="Description" rows={2} value={item.desc} onChange={(desc) => change({ desc })} />
                <LinesField label="Core topics" value={item.topics} onChange={(topics) => change({ topics })} />
                <ImageLinkField label="Image" value={item.image} onChange={(image) => change({ image })} />
              </div>
            )}
          />
        </Field>
      </Group>

      <Group title="Roadmaps" {...groupProps}>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Roadmaps have their own page now. Open Study Roadmaps in the admin menu to add 1, 5, 10 or 30 day plans for this
          course, set their heading, and show or hide them.
        </p>
      </Group>

      <Group title="Guarantee" sectionKey="guarantee" {...groupProps}>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          This is a public promise, so show it only if the course really offers it.
        </p>
        <TextInput label="Badge" {...partField('guarantee', 'badge')} />
        <TextInput label="Title" {...partField('guarantee', 'title')} />
        <TextArea label="Text" {...partField('guarantee', 'text')} />
        <TextInput label="List heading" {...partField('guarantee', 'listTitle')} />
        <LinesField label="List points" {...partField('guarantee', 'points')} />
        <TextArea label="Closing line" rows={2} {...partField('guarantee', 'closing')} />
        <TextInput label="Small print" {...partField('guarantee', 'note')} />
      </Group>

      <Group title="Testimonials" sectionKey="testimonials" {...groupProps}>
        <TextInput label="Badge" {...partField('testimonials', 'badge')} />
        <TextInput label="Heading" {...partField('testimonials', 'heading')} />
        <TextArea label="Subheading" rows={2} {...partField('testimonials', 'subheading')} />
        <Field label="Result numbers">
          <RepeatList
            items={page.testimonials?.stats}
            onChange={(stats) => setPart('testimonials', { stats })}
            blank={{ number: '', label: '' }}
            addLabel="Add Number"
            itemTitle={(item) => item.label}
            renderItem={(item, change) => (
              <div className="grid grid-cols-2 gap-2">
                <TextInput label="Number" value={item.number} onChange={(number) => change({ number })} />
                <TextInput label="Label" value={item.label} onChange={(label) => change({ label })} />
              </div>
            )}
          />
        </Field>
        <RepeatList
          items={page.testimonials?.items}
          onChange={(items) => setPart('testimonials', { items })}
          blank={{ name: '', role: '', image: '', comment: '', rating: 5, course: '', achievement: '' }}
          addLabel="Add Testimonial"
          itemTitle={(item) => item.name}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TextInput label="Name" value={item.name} onChange={(name) => change({ name })} />
                <TextInput label="Role" value={item.role} onChange={(role) => change({ role })} />
                <TextInput label="Course" value={item.course} onChange={(course) => change({ course })} />
                <TextInput label="Achievement" value={item.achievement} onChange={(achievement) => change({ achievement })} />
              </div>
              <TextArea label="Comment" rows={3} value={item.comment} onChange={(comment) => change({ comment })} />
              <TextInput label="Rating (1 to 5)" type="number" min="1" max="5" value={item.rating} onChange={(rating) => change({ rating })} />
              <ImageLinkField label="Photo" value={item.image} onChange={(image) => change({ image })} />
            </div>
          )}
        />
      </Group>

      <Group title="Stats" sectionKey="stats" {...groupProps}>
        <RepeatList
          items={page.stats}
          onChange={(stats) => setPage({ stats })}
          blank={{ number: '', label: '' }}
          addLabel="Add Stat"
          itemTitle={(item) => item.label}
          renderItem={(item, change) => (
            <div className="grid grid-cols-2 gap-2">
              <TextInput label="Number" value={item.number} onChange={(number) => change({ number })} />
              <TextInput label="Label" value={item.label} onChange={(label) => change({ label })} />
            </div>
          )}
        />
      </Group>

      <Group title="FAQs" sectionKey="faqs" {...groupProps}>
        <TextInput label="Badge" {...partField('faqs', 'badge')} />
        <TextInput label="Heading" {...partField('faqs', 'heading')} />
        <TextArea label="Subheading" rows={2} {...partField('faqs', 'subheading')} />
        <RepeatList
          items={page.faqs?.items}
          onChange={(items) => setPart('faqs', { items })}
          blank={{ q: '', a: '' }}
          addLabel="Add Question"
          itemTitle={(item) => item.q}
          renderItem={(item, change) => (
            <div className="space-y-2">
              <TextInput label="Question" value={item.q} onChange={(q) => change({ q })} />
              <TextArea label="Answer" rows={3} value={item.a} onChange={(a) => change({ a })} />
            </div>
          )}
        />
      </Group>
    </div>
  );
}
