import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  Search, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Tv,
  Tag,
  Sparkles,
  Info,
  Feather
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'prose',
    number: '1',
    name: 'Prose',
    description: 'Line-by-line explanation, Lincoln’s inspiring message, Bachendri Pal’s summit, technology impacts, disaster response, and nation building.',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'Letter to His Son’s Teacher',
        url: 'https://youtu.be/t2IHb1O4mMU?si=9I4cWj-68kNiUo7P',
        videoId: 't2IHb1O4mMU',
        keywords: [
          "Letter to His Son's Teacher explanation",
          'Abraham Lincoln letter to teacher',
          'AP Intermediate 1st year English prose summary',
          'line by line explanation',
          'question answers'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'She Conquered the Everest',
        url: 'https://youtu.be/WRGDRMAbGSQ?si=NCedcvWq3TwxZ_Xa',
        videoId: 'WRGDRMAbGSQ',
        keywords: [
          'She Conquered the Everest lesson explanation',
          'Bachendri Pal biography',
          'Everest expedition story',
          'AP Inter 1st year English summary',
          'question answers'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Digital Technologies',
        url: 'https://youtu.be/4LeUOUUhZyg?si=Cv4wT6iu6Jb-3wZ0',
        videoId: '4LeUOUUhZyg',
        keywords: [
          'Digital Technologies lesson explanation',
          'digital technology essay',
          'technology in daily life',
          'AP Intermediate English prose summary',
          'question answers'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Disaster Management',
        url: 'https://youtu.be/9WIwlljva_s?si=iWBBt7MoEjelDCCq',
        videoId: '9WIwlljva_s',
        keywords: [
          'Disaster Management lesson explanation',
          'types of disasters',
          'disaster preparedness and response',
          'AP Inter English summary',
          'question answers'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'What Makes a Nation?',
        url: 'https://youtu.be/JSOJdHdXgsM?si=8NRyWhqASrGplAtz',
        videoId: 'JSOJdHdXgsM',
        keywords: [
          'What Makes a Nation lesson explanation',
          'nation building',
          'qualities of a nation',
          'AP Intermediate 1st year English prose',
          'summary and question answers'
        ]
      }
    ]
  },
  {
    id: 'poetry',
    number: '2',
    name: 'Poetry',
    description: 'Poetic devices, central themes, line-by-line stanza analysis, Rabindranath Tagore, Langston Hughes, and philosophical reflections.',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Commonwealth of Bees',
        url: 'https://youtu.be/G-QeKMx49C0?si=Q9luC6BjiSopJJcj',
        videoId: 'G-QeKMx49C0',
        keywords: [
          'Commonwealth of Bees poem explanation',
          'Commonwealth of Bees summary',
          'poem theme and central idea',
          'poetic devices',
          'AP Inter English questions'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'This Is My Prayer to Thee, My Lord!',
        url: 'https://youtu.be/Z6iPfwvwtOA?si=Dfx_qln1P1_JeSgO',
        videoId: 'Z6iPfwvwtOA',
        keywords: [
          'This Is My Prayer to Thee My Lord poem explanation',
          'Rabindranath Tagore poem',
          'poem summary',
          'central idea',
          'line by line explanation'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'As I Grew Older',
        url: 'https://youtu.be/aI9jA7fOMgc?si=dNt3IaKqjA7MJ2gH',
        videoId: 'aI9jA7fOMgc',
        keywords: [
          'As I Grew Older poem explanation',
          'Langston Hughes poem',
          'symbolism of the wall',
          'poem summary',
          'theme and poetic devices'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Body',
        url: 'https://youtu.be/YotVhsiQKyc?si=azNk_BYU0ZMIBz-c',
        videoId: 'YotVhsiQKyc',
        keywords: [
          'Body poem explanation',
          'poem summary and central idea',
          'line by line explanation',
          'poetic devices',
          'AP Intermediate English questions'
        ]
      },
      {
        id: '2-5',
        code: '2.5',
        title: 'To a Student',
        url: 'https://youtu.be/u-FCI027p0w?si=K5awrgXbuYD8P3nQ',
        videoId: 'u-FCI027p0w',
        keywords: [
          'To a Student poem explanation',
          'poem summary',
          'message to students',
          'central idea and theme',
          'AP Inter English question answers'
        ]
      }
    ]
  },
  {
    id: 'extensive-reading',
    number: '3',
    name: 'Extensive Reading',
    description: 'Engaging short stories & drama by R. K. Narayan, O. Henry, subtle irony, characters, moral dilemmas, and play dialogues.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Engine Trouble',
        url: 'https://youtu.be/0sZAYR4LLhA?si=Qlv_CCtDk45nR0UH',
        videoId: '0sZAYR4LLhA',
        keywords: [
          'Engine Trouble R K Narayan story explanation',
          'Engine Trouble summary',
          'character sketch',
          'humour and irony',
          'AP Inter English questions'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'The Last Leaf',
        url: 'https://youtu.be/lbx0WfJRgX4?si=ZA02KR0PnppxCYU_',
        videoId: 'lbx0WfJRgX4',
        keywords: [
          'The Last Leaf O Henry story explanation',
          'The Last Leaf summary',
          'Johnsy Sue and Behrman',
          'character sketch',
          'theme and question answers'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'The Immaculate Child',
        url: 'https://youtu.be/-xeqVGN6q7w?si=DOQ-ghwFhfPCu-5i',
        videoId: '-xeqVGN6q7w',
        keywords: [
          'The Immaculate Child story explanation',
          'story summary',
          'characters and theme',
          'line by line explanation',
          'AP Intermediate English questions'
        ]
      },
      {
        id: '3-4',
        code: '3.4',
        title: 'Will He Come Home?',
        url: 'https://youtu.be/SQc0bNCyrto?si=hjxdKk0bDHU9J9o1',
        videoId: 'SQc0bNCyrto',
        keywords: [
          'Will He Come Home story explanation',
          'story summary',
          'characters and theme',
          'title significance',
          'AP Inter English question answers'
        ]
      },
      {
        id: '3-5',
        code: '3.5',
        title: 'The Informer',
        url: 'https://youtu.be/Fpxko62UirQ?si=Uu6dW5mluHowgtc9',
        videoId: 'Fpxko62UirQ',
        keywords: [
          'The Informer one act play explanation',
          'play summary',
          'characters',
          'plot and theme',
          'dialogue explanation',
          'AP Intermediate English questions'
        ]
      }
    ]
  },
  {
    id: 'grammar',
    number: '4',
    name: 'Grammar',
    description: 'Comprehensive syntax rules, Parts of Speech, Articles, Prepositions, Voice, Reported Speech, Concord, and Error Correction.',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Parts of Speech',
        url: 'https://youtu.be/chjmnCSPnbw?si=xMi8iQlO_0kcqhEt',
        videoId: 'chjmnCSPnbw',
        keywords: [
          'Parts of Speech in English grammar',
          'noun pronoun verb adjective adverb',
          'preposition conjunction interjection',
          'examples and exercises'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'Articles',
        url: 'https://youtu.be/BPvQuN3oo0U?si=nSA9wG9HPYullVgx',
        videoId: 'BPvQuN3oo0U',
        keywords: [
          'Articles A An The rules',
          'use of articles in English',
          'definite and indefinite articles',
          'articles exercises with answers'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'Prepositions',
        url: 'https://youtu.be/sN5H7YTo_IQ?si=DAe8xI5JR1Y-_mh_',
        videoId: 'sN5H7YTo_IQ',
        keywords: [
          'Prepositions in English grammar',
          'prepositions of time place and movement',
          'in on at by for since',
          'preposition exercises with answers'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'Sentence Patterns',
        url: 'https://youtu.be/jul2urONzOQ?si=TuVGw5DqCYMAM-Ew',
        videoId: 'jul2urONzOQ',
        keywords: [
          'English sentence patterns',
          'subject verb object complement',
          'SVO SVC SVA patterns',
          'sentence structure examples',
          'grammar exercises'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'Time, Tense and Aspect',
        url: 'https://youtu.be/sCiG6rlk2Bc?si=JNEfdw9re8_QAtHa',
        videoId: 'sCiG6rlk2Bc',
        keywords: [
          'English tenses and aspects',
          'present past future tense',
          'simple continuous perfect perfect continuous',
          'tense rules and exercises'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'Modal Auxiliaries',
        url: 'https://youtu.be/36wG9pSYu7Q?si=2AvKEFqUN5mmz9Xv',
        videoId: '36wG9pSYu7Q',
        keywords: [
          'Modal auxiliary verbs',
          'can could may might must should would shall will',
          'uses of modals',
          'modal verbs exercises'
        ]
      },
      {
        id: '4-7',
        code: '4.7',
        title: 'Concord: Agreement of Subject and Verb',
        url: 'https://youtu.be/tH5QxA25xkk?si=drU0R--cUsB9UpAU',
        videoId: 'tH5QxA25xkk',
        keywords: [
          'Subject verb agreement rules',
          'concord in English grammar',
          'singular plural subjects',
          'subject verb agreement exercises with answers'
        ]
      },
      {
        id: '4-8',
        code: '4.8',
        title: 'Active and Passive Voice',
        url: 'https://youtu.be/fo46yFWIJzU?si=MHiRTjmKbkbarKC9',
        videoId: 'fo46yFWIJzU',
        keywords: [
          'Active and passive voice rules',
          'change active to passive',
          'passive voice all tenses',
          'examples and exercises with answers'
        ]
      },
      {
        id: '4-9',
        code: '4.9',
        title: 'Reported Speech',
        url: 'https://youtu.be/eplQBhE0-Hg?si=ZV60GmLezOAOTT67',
        videoId: 'eplQBhE0-Hg',
        keywords: [
          'Direct and indirect speech',
          'reported speech rules',
          'narration change',
          'statements questions commands',
          'reported speech exercises'
        ]
      },
      {
        id: '4-10',
        code: '4.10',
        title: 'Degrees of Comparison',
        url: 'https://youtu.be/xpwlNGmMcFM?si=XWFEdiyJwd07dMiJ',
        videoId: 'xpwlNGmMcFM',
        keywords: [
          'Degrees of comparison',
          'positive comparative superlative',
          'transformation of sentences',
          'comparison rules and exercises'
        ]
      },
      {
        id: '4-11',
        code: '4.11',
        title: 'Clause Analysis and Synthesis of Sentences',
        url: 'https://youtu.be/WevEWotQhNw?si=_NDQA0j7hf5X_hd1',
        videoId: 'WevEWotQhNw',
        keywords: [
          'Clause analysis in English grammar',
          'independent and dependent clauses',
          'simple compound complex sentences',
          'synthesis of sentences',
          'examples'
        ]
      },
      {
        id: '4-12',
        code: '4.12',
        title: 'Question Tags',
        url: 'https://youtu.be/RaC2Hqd5yFU?si=lWRxq6YODTTrzE45',
        videoId: 'RaC2Hqd5yFU',
        keywords: [
          'Question tags rules',
          'positive and negative question tags',
          'auxiliary verbs in question tags',
          'question tag exercises with answers'
        ]
      },
      {
        id: '4-13',
        code: '4.13',
        title: 'Phrasal Verbs',
        url: 'https://youtu.be/Emdc5LIhHa4?si=q0bFoQH_kK-fdB7A',
        videoId: 'Emdc5LIhHa4',
        keywords: [
          'Phrasal verbs with meanings and examples',
          'common English phrasal verbs',
          'phrasal verbs list',
          'phrasal verb exercises'
        ]
      },
      {
        id: '4-14',
        code: '4.14',
        title: 'Correction of Sentences',
        url: 'https://youtu.be/jul2urONzOQ?si=e8PJ9_Xa61rED-qz',
        videoId: 'jul2urONzOQ',
        keywords: [
          'Correction of sentences English grammar',
          'error spotting',
          'common grammatical errors',
          'sentence improvement',
          'practice questions with answers'
        ]
      }
    ]
  },
  {
    id: 'communication-skills',
    number: '5',
    name: 'Communication Skills',
    description: 'Phonetics, consonant and vowel charts, syllable stress, silent letters, and visual information transfer for exam excellence.',
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    videos: [
      {
        id: '5-1-1',
        code: '5.1 (Part 1)',
        title: 'Word Power — Video 1',
        url: 'https://youtu.be/NPUBluoyWUQ?si=giC-Y5uPQh-edxtr',
        videoId: 'NPUBluoyWUQ',
        keywords: [
          'Word Power English vocabulary',
          'synonyms and antonyms',
          'one word substitutions',
          'idioms and phrases',
          'vocabulary building',
          'AP Intermediate English'
        ]
      },
      {
        id: '5-1-2',
        code: '5.1 (Part 2)',
        title: 'Word Power — Video 2',
        url: 'https://youtu.be/FSR1JQ3BNcs?si=G4m32t7av32rkHXS',
        videoId: 'FSR1JQ3BNcs',
        keywords: [
          'Word Power English vocabulary',
          'synonyms and antonyms',
          'one word substitutions',
          'idioms and phrases',
          'vocabulary building',
          'AP Intermediate English'
        ]
      },
      {
        id: '5-2a',
        code: '5.2a',
        title: 'Introduction to Sounds — Consonants',
        url: 'https://youtu.be/Mp6-YRrVTwU?si=5G2M91c_PjG-VzLX',
        videoId: 'Mp6-YRrVTwU',
        keywords: [
          'English consonant sounds',
          'consonant phonetics',
          'voiced and voiceless consonants',
          'pronunciation practice',
          'consonant sounds chart'
        ]
      },
      {
        id: '5-2b',
        code: '5.2b',
        title: 'Introduction to Sounds — Vowels',
        url: 'https://youtu.be/_YiPikFe4cQ?si=i-9NaXqH3g6gqC4O',
        videoId: '_YiPikFe4cQ',
        keywords: [
          'English vowel sounds',
          'short and long vowels',
          'vowel phonetics',
          'monophthongs and diphthongs',
          'pronunciation practice'
        ]
      },
      {
        id: '5-2c',
        code: '5.2c',
        title: 'Introduction to Sounds — Silent Letters',
        url: 'https://www.youtube.com/results?search_query=AP+Inter+1st+year+English+silent+letters',
        videoId: null,
        keywords: [
          'Silent letters in English words',
          'words with silent letters',
          'silent K W B L T letters',
          'English pronunciation rules and examples'
        ]
      },
      {
        id: '5-2d',
        code: '5.2d',
        title: 'Introduction to Sounds — Syllables',
        url: 'https://youtu.be/Vu6UVwkUgzc?si=qvOyPD2092EraN-n',
        videoId: 'Vu6UVwkUgzc',
        keywords: [
          'Syllables in English',
          'syllable division',
          'counting syllables in words',
          'word stress and syllables',
          'pronunciation exercises'
        ]
      },
      {
        id: '5-3',
        code: '5.3',
        title: 'Information Transfer',
        url: 'https://youtu.be/CzViY0LPX1E?si=G47VNENQlj9eB2e3',
        videoId: 'CzViY0LPX1E',
        keywords: [
          'Information transfer in English',
          'verbal to non verbal information',
          'charts graphs tables diagrams',
          'paragraph to flowchart',
          'exam examples'
        ]
      },
      {
        id: '5-4',
        code: '5.4',
        title: 'Communicating Better',
        url: 'https://youtu.be/NaNe5rwUXgw?si=eWVelxnqhdKLyaU9',
        videoId: 'NaNe5rwUXgw',
        keywords: [
          'Communicating Better English lesson explanation',
          'effective communication skills',
          'verbal and nonverbal communication',
          'communication barriers',
          'summary and questions'
        ]
      }
    ]
  }
];

// Helper to normalize strings for flexible, resilient search (lowercased, alphanumeric only)
const normalize = (str) => 
  (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Flatten all videos for navigation and search
const ALL_VIDEOS = TOPICS_DATA.flatMap(topic => 
  topic.videos.map(video => ({
    ...video,
    topicId: topic.id,
    topicName: topic.name,
    topicNumber: topic.number,
    topicColor: topic.color,
    badgeColor: topic.badgeColor
  }))
);

// Academic syllabus modules for alternate track exploration
const ACADEMIC_MODULES = [
  {
    id: 'eng-1st-year',
    name: '1st Year Junior English',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    desc: 'Complete coverage of Junior Inter Prose, Poetry, Short Stories, Parts of Speech, Articles, Prepositions, Tenses, and Error Correction for 100/100 marks.'
  },
  {
    id: 'eng-2nd-year',
    name: '2nd Year Senior English',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
    desc: 'Senior Inter Prose, Classic Poetry, Non-detailed texts, Letter Writing, Curriculum Vitae (CV) formatting, and Phonetics transcription for board exams.'
  },
  {
    id: 'eng-grammar',
    name: 'Grammar & Syntax Mastery',
    category: 'Core Language',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    desc: 'Master Active & Passive Voice, Direct & Indirect Speech, Degrees of Comparison, Question Tags, Sentence Transformation, and Clauses without memorization.'
  },
  {
    id: 'eng-comprehension',
    name: 'Reading Comprehension & Précis',
    category: 'Critical Thinking',
    image: 'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?q=80&w=600&auto=format&fit=crop',
    desc: 'Fast reading strategies, skimming & scanning unseen passages, note-making blueprints, précis drafting, and inference-based question solving.'
  },
  {
    id: 'eng-writing',
    name: 'Essay & Creative Composition',
    category: 'Expressive Writing',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    desc: 'Structured essay templates, descriptive writing, persuasive articles, business & official letters, dialogue composition, and speech writing.'
  },
  {
    id: 'eng-phonetics',
    name: 'Phonetics & Spoken Fluency',
    category: 'Pronunciation & Speech',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    desc: 'Learn International Phonetic Alphabet (IPA) symbols, silent letters, syllable stress, intonation patterns, and confident public speaking.'
  },
  {
    id: 'eng-competitive',
    name: 'CUET, IELTS & Competitive Verbal',
    category: 'Entrance & Global',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    desc: 'High-frequency vocabulary, verbal analogies, idiom roots, contextual usage, sentence completion, and speed reading for CUET, EAMCET & IELTS.'
  }
];

export default function EnglishCurriculum({ onEnroll }) {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeView, setActiveView] = useState('lectures'); // 'lectures' | 'modules'

  // Search and filter logic
  const { filteredVideos, isSearching } = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const isSearching = trimmedQuery.length > 0;

    let list = ALL_VIDEOS;

    if (!isSearching && selectedTopicId !== 'all') {
      list = list.filter(v => v.topicId === selectedTopicId);
      return { filteredVideos: list, isSearching };
    }

    if (isSearching) {
      const rawLower = trimmedQuery.toLowerCase();
      const normQ = normalize(trimmedQuery);
      const queryTokens = normQ.split(' ').filter(Boolean);

      const matches = ALL_VIDEOS.map(video => {
        const titleNorm = normalize(video.title);
        const codeNorm = normalize(video.code);
        const topicNorm = normalize(video.topicName);
        const keywordsNorm = (video.keywords || []).map(k => normalize(k));

        const directTitleMatch = video.title.toLowerCase().includes(rawLower) || titleNorm.includes(normQ);
        const directCodeMatch = video.code.toLowerCase().includes(rawLower) || codeNorm.includes(normQ);
        const directTopicMatch = video.topicName.toLowerCase().includes(rawLower) || topicNorm.includes(normQ);

        const matchedKeywords = (video.keywords || []).filter(kw => {
          const kwNorm = normalize(kw);
          return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
        });

        const allTokensInCombined = queryTokens.length > 0 && queryTokens.every(token => {
          return (
            titleNorm.includes(token) ||
            codeNorm.includes(token) ||
            topicNorm.includes(token) ||
            keywordsNorm.some(kw => kw.includes(token))
          );
        });

        const isMatch = directTitleMatch || directCodeMatch || directTopicMatch || matchedKeywords.length > 0 || allTokensInCombined;

        if (isMatch) {
          return {
            ...video,
            matchedKeyword: matchedKeywords[0] || (directTitleMatch ? null : (video.keywords && video.keywords[0]))
          };
        }
        return null;
      }).filter(Boolean);

      if (selectedTopicId !== 'all') {
        const tabFiltered = matches.filter(v => v.topicId === selectedTopicId);
        if (tabFiltered.length > 0) {
          return { filteredVideos: tabFiltered, isSearching };
        }
      }

      return { filteredVideos: matches, isSearching };
    }

    return { filteredVideos: list, isSearching };
  }, [selectedTopicId, searchQuery]);

  // Find index in filtered list for next/prev navigation
  const currentVideoIndex = useMemo(() => {
    if (!activeVideo) return -1;
    return filteredVideos.findIndex(v => v.id === activeVideo.id);
  }, [activeVideo, filteredVideos]);

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setActiveVideo(filteredVideos[currentVideoIndex - 1]);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex >= 0 && currentVideoIndex < filteredVideos.length - 1) {
      setActiveVideo(filteredVideos[currentVideoIndex + 1]);
    }
  };

  return (
    <section id="english-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-4 border border-amber-200/80 dark:border-amber-800/80 shadow-xs">
            <Tv size={15} />
            <span>AP & TS Intermediate English Video Lectures & Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            English Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore chapter-by-chapter summaries, line-by-line poem analysis, non-detailed stories, comprehensive grammar rules, and communication skills for a guaranteed 100/100.
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  These are curated sample demo lectures. <strong>Enroll now</strong> to get full access to detailed line-by-line explanations, grammar worksheets, and live 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('English Full Course - Complete 1st Year Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* View Mode Toggle (Video Lectures vs Academic Tracks) */}
          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveView('lectures')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'lectures'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv size={15} />
              <span>Video Lectures ({ALL_VIDEOS.length})</span>
            </button>
            <button
              onClick={() => setActiveView('modules')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'modules'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen size={15} />
              <span>Syllabus Modules ({ACADEMIC_MODULES.length})</span>
            </button>
          </div>
        </div>

        {activeView === 'lectures' ? (
          <>
            {/* Filter Controls: Topic Tabs & Smart Keyword Search Bar */}
            <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              
              {/* Topic Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedTopicId('all')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedTopicId === 'all' && !isSearching
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All Topics ({ALL_VIDEOS.length})
                </button>
                {TOPICS_DATA.map((topic) => {
                  const isActive = selectedTopicId === topic.id && !isSearching;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {topic.number}. {topic.name} ({topic.videos.length})
                    </button>
                  );
                })}
              </div>

              {/* Smart Keyword Search Bar */}
              <div className="relative w-full lg:w-96 shrink-0">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chapter or grammar topic (e.g. Lincoln, Voice, Articles, Tenses...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400 shadow-xs"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Notification Banner */}
            {isSearching && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                  <Search size={14} className="text-amber-600 dark:text-amber-400" />
                  <span>
                    Found <strong className="font-bold text-amber-700 dark:text-amber-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'lecture' : 'lectures'} for "<em>{searchQuery}</em>"
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  Clear filter <X size={12} />
                </button>
              </div>
            )}

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching lectures found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                  Try searching with keywords like <strong>Lincoln</strong>, <strong>Active Voice</strong>, <strong>Question Tags</strong>, <strong>Reported Speech</strong>, or <strong>Prepositions</strong>.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Search & View All ({ALL_VIDEOS.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => {
                  const thumbnailUrl = video.videoId 
                    ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` 
                    : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop';

                  return (
                    <div
                      key={video.id}
                      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1"
                    >
                      {/* Thumbnail Container */}
                      <div 
                        onClick={() => setActiveVideo(video)}
                        className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
                      >
                        <img
                          src={thumbnailUrl}
                          alt={video.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                        {/* Chapter / Topic Code Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white font-mono text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
                          <Layers size={12} className="text-amber-400" />
                          <span>Topic {video.code}</span>
                        </div>

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-13 h-13 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-115 transition-transform duration-300 ring-4 ring-white/30">
                            <Play size={22} className="ml-0.5 fill-white" />
                          </div>
                        </div>

                        {/* YouTube Brand Indicator */}
                        <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                          <span>{video.videoId ? 'YouTube Lecture' : 'Video Tutorial'}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Topic Name Breadcrumb */}
                          <div className="text-[11px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                            <span>{video.topicName}</span>
                          </div>

                          {/* Video Title */}
                          <h3 
                            onClick={() => setActiveVideo(video)}
                            className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug mb-2"
                            title={video.title}
                          >
                            <span className="text-amber-600 dark:text-amber-400 font-extrabold mr-1.5">{video.code}</span>
                            {video.title}
                          </h3>

                          {/* Matching Keyword Indicator tag if matched via search */}
                          {isSearching && video.matchedKeyword && (
                            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200/60 dark:border-amber-800/60 max-w-full truncate">
                              <Tag size={10} className="shrink-0" />
                              <span className="truncate">Matches: {video.matchedKeyword}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                          <button
                            onClick={() => setActiveVideo(video)}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-amber-600/20"
                          >
                            <Play size={14} className="fill-white" /> Watch Now
                          </button>

                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title={video.videoId ? 'Open on YouTube' : 'Search on YouTube'}
                            aria-label={`Open ${video.title} on YouTube`}
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Academic Modules View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {ACADEMIC_MODULES.map((mod) => (
              <div key={mod.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 h-[380px] group hover:-translate-y-1 relative">
                <div className="h-40 w-full overflow-hidden relative shrink-0">
                  <img src={mod.image} alt={mod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white">
                    <BookOpen size={20} />
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                      {mod.category}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {mod.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      onClick={() => onEnroll && onEnroll(`English: ${mod.name}`)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>Enroll in Module</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Doubt Clearing & Live Tuition CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-10 border border-amber-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Live 1-on-1 Faculty Mentorship</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Personal Mentorship or Have Doubts in English Grammar & Literature?
              </h3>
              <p className="text-amber-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, answer-script presentation templates, error-free grammar drills, and line-by-line textbook analysis to score a guaranteed 100/100 in Board English.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('English 1-on-1 Live Doubt & Board Coaching')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <span>Book 1-on-1 Doubt Session</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Video Player Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 shrink-0">
                  Topic {activeVideo.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Responsive 16:9 YouTube Player or Fallback View */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideo.videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-b from-slate-900 to-slate-950">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                    <Feather size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{activeVideo.title}</h4>
                  <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
                    Direct video link for this specific topic is being updated. You can explore curated lectures on YouTube or request faculty notes right away!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={activeVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink size={15} />
                      <span>Search on YouTube</span>
                    </a>
                    <button
                      onClick={() => {
                        const current = activeVideo;
                        setActiveVideo(null);
                        if (onEnroll) onEnroll(`Request Notes for: ${current.title}`);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <span>Request Faculty Notes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-3.5 bg-slate-800/90 border-t border-slate-700/60 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevVideo}
                  disabled={currentVideoIndex <= 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex >= filteredVideos.length - 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Next <ChevronRight size={16} />
                </button>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  {currentVideoIndex + 1} of {filteredVideos.length}
                </span>
              </div>

              <button
                onClick={() => {
                  const current = activeVideo;
                  setActiveVideo(null);
                  if (onEnroll) onEnroll(`English Help: Topic ${current.code} - ${current.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <span>Ask Doubt in this Topic</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
