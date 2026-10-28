import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Play, 
  ExternalLink, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Tv,
  Sparkles,
  Info,
  Feather,
  Clock,
  GraduationCap
} from 'lucide-react';
import { fetchStudentVideos } from '../../services/api';

const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// =========================================================================
// URDU CHAPTER-WISE VIDEO LECTURES DATA
// =========================================================================
const RAW_TOPICS_DATA = [
  {
    id: 'poetry',
    number: '1',
    name: 'Poetry (شاعری)',
    urduName: 'حصہ شاعری و منظومات',
    description: 'غزلیات و منظومات کا مفہوم، اسلوب و تشریح۔ مرزا غالب، فیض احمد فیض، علامہ اقبال، حسرت موہانی اور مخدوم محی الدین کی لازوال شاعری کے اشعار کی مفصل تشریح۔',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'Ghazals (غزلیات)',
        urduTitle: 'غزلیات — تفہیم و تشریح',
        author: 'Urdu Ghazals',
        genre: 'Ghazal (غزل)',
        url: 'https://youtu.be/Bsr3XBdQCWs?si=Jl_vvll81cXUpIDI',
        videoId: 'Bsr3XBdQCWs',
        description: 'غزل کی ہیئت، مطلع و مقطع کے اصول، ردیف و قافیہ کی شناخت اور منتخب غزلیات کی جامع تشریح۔',
        keywords: [
          'Ghazals',
          'غزلیات',
          'اردو غزل',
          'ردیف و قافیہ',
          'مطلع و مقطع',
          'تفسیر و تشریح',
          'Board Exam Urdu'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Nazms (نظمیں)',
        urduTitle: 'منظومات — ہیئت و فکری تجزیہ',
        author: 'Urdu Nazm',
        genre: 'Nazm (نظم)',
        url: 'https://youtu.be/jVpMN4l83aY?si=C5X8lLNxbZGgXBhA',
        videoId: 'jVpMN4l83aY',
        description: 'نظم کی تعریف، اقسام، فکری تسلسل، مرکزی خیال اور منظومات کے بندوں کی معنی خیز تشریح۔',
        keywords: [
          'Nazms',
          'نظمیں',
          'اردو نظمیں',
          'مرکزی خیال',
          'بند کی تشریح',
          'خلاصہ کلام',
          'AP TS Intermediate'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Poetry by Mirza Ghalib (مرزا غالب کی شاعری)',
        urduTitle: 'دیوانِ غالب — منتخب اشعار کی تشریح',
        author: 'Mirza Ghalib (مرزا غالب)',
        genre: 'Classical Ghazal',
        url: 'https://youtu.be/otKBJubsONw?si=fN6hB2MoJ1E0fYuF',
        videoId: 'otKBJubsONw',
        description: 'مرزا اسد اللہ خان غالب کے کلام کی انفرادیت، نازک خیالی، فلسفہ و تصوف اور امتحانی اشعار کے حل۔',
        keywords: [
          'Mirza Ghalib',
          'مرزا غالب',
          'غالب کی شاعری',
          'دیوان غالب',
          'غالب کے اشعار',
          'تفسیر و تشریح',
          'Urdu Poetry'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Poetry by Faiz Ahmed Faiz (فیض احمد فیض کی شاعری)',
        urduTitle: 'فیض احمد فیض — رومان اور انقلابی لب و لہجہ',
        author: 'Faiz Ahmed Faiz (فیض احمد فیض)',
        genre: 'Modern Poetry',
        url: 'https://youtu.be/pwzmBiK_wZM?si=apU-vOyTR_TB0thK',
        videoId: 'pwzmBiK_wZM',
        description: 'ترقی پسند تحریک، فیض کا جمالیاتی اور انقلابی شعور، اور ان کی مشہور غزلوں و نظموں کی تفہیم۔',
        keywords: [
          'Faiz Ahmed Faiz',
          'فیض احمد فیض',
          'ترقی پسند شاعری',
          'انقلاب و رومان',
          'دست صبا',
          'نقش فریادی',
          'Tashreeh'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'Poetry by Allama Iqbal (علامہ اقبال کی شاعری)',
        urduTitle: 'علامہ اقبال — فلسفہ خودی و پیغامِ حیات',
        author: 'Allama Iqbal (علامہ اقبال)',
        genre: 'Philosophical Poetry',
        url: 'https://youtu.be/5kdhtW67dMk?si=GKKIArKrgl1QlYGH',
        videoId: '5kdhtW67dMk',
        description: 'شاعرِ مشرق علامہ اقبال کا فلسفہ خودی، نوجوانوں کے لیے پیغامات، اور بانگِ درا و بالِ جبریل کے کلام کی تشریح۔',
        keywords: [
          'Allama Iqbal',
          'علامہ اقبال',
          'فلسفہ خودی',
          'شاعر مشرق',
          'بانگ درا',
          'شاہین',
          'Urdu Board Poetry'
        ]
      },
      {
        id: '1-6',
        code: '1.6',
        title: 'Poetry by Hasrat Mohani (حسرت موہانی کی شاعری)',
        urduTitle: 'حسرت موہانی — رئیس المتغزلین کا کلاسیکی کلام',
        author: 'Hasrat Mohani (حسرت موہانی)',
        genre: 'Classical Ghazal',
        url: 'https://youtu.be/vn0nFThvlqg?si=Nu9DpvmuCjIam6JW',
        videoId: 'vn0nFThvlqg',
        description: 'مولانا حسرت موہانی کی پاکیزہ تغزل، حسن و عشق کے لطیف جذبات اور سیاسی و ادبی امتزاج۔',
        keywords: [
          'Hasrat Mohani',
          'حسرت موہانی',
          'رئیس المتغزلین',
          'چپکے چپکے رات دن',
          'کلاسیکی تغزل',
          'توصیف اشعار',
          'Urdu Ghazal'
        ]
      },
      {
        id: '1-7',
        code: '1.7',
        title: 'Poetry by Makhdoom Mohiuddin (مخدوم محی الدین کی شاعری)',
        urduTitle: 'مخدوم محی الدین — دکن کا انقلابی و عوامی شاعر',
        author: 'Makhdoom Mohiuddin (مخدوم محی الدین)',
        genre: 'Progressive Poetry',
        url: 'https://youtu.be/PjdzymGn4BI?si=leo3nsycLN4XDdrL',
        videoId: 'PjdzymGn4BI',
        description: 'حیدرآباد دکن کے ممتاز شاعر مخدوم محی الدین کی عوامی نظمیں، تلنگانہ کسان تحریک کا اثر اور ترنم۔',
        keywords: [
          'Makhdoom Mohiuddin',
          'مخدوم محی الدین',
          'دکن اردو',
          'حیدرآباد',
          'سرخ سویرا',
          'تلنگانہ لٹریچر',
          'Urdu Telangana'
        ]
      }
    ]
  },
  {
    id: 'prose',
    number: '2',
    name: 'Prose (نثر)',
    urduName: 'حصہ نثر و نثری اسباق',
    description: 'ناول، ڈراما اور شاہکار افسانے: منشی پریم چند کا ناول نرملا، مشہور ڈراما دروازہ، اور راجندر سنگھ بیدی کا افسانہ گرم کوٹ و آڑو کی تفصیلی تفہیم۔',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Nirmala — Munshi Prem Chand (نرملا — منشی پریم چند)',
        urduTitle: 'ناول نرملا — منشی پریم چند (خلاصہ و کردار نگاری)',
        author: 'Munshi Prem Chand (منشی پریم چند)',
        genre: 'Novel (ناول)',
        url: 'https://youtu.be/vQSCw37RoCk?si=sMe24w0dzoCAlix4',
        videoId: 'vQSCw37RoCk',
        description: 'ناول نرملا کا تفصیلی خلاصہ، غیر موافق شادی کا سماجی المیہ، کرداروں کی نفسیات اور بورڈ کے سوالات۔',
        keywords: [
          'Nirmala',
          'Munshi Prem Chand',
          'نرملا',
          'منشی پریم چند',
          'ناول خلاصہ',
          'کردار نگاری',
          'Prose Lesson'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Darwaza — Drama (ڈراما — دروازہ)',
        urduTitle: 'ڈراما دروازہ — پلاٹ و مکالمہ نگاری',
        author: 'Urdu Drama',
        genre: 'Drama (ڈراما)',
        url: 'https://youtu.be/q1YJd2VOl_s?si=CGKrpLmY_gFJL30l',
        videoId: 'q1YJd2VOl_s',
        description: 'ڈراما دروازہ کے مکالمے، وحدت ثلاثہ، کشمکش، اسلوبِ بیان اور مرکزی خیال کا جامع جائزہ۔',
        keywords: [
          'Darwaza',
          'Drama',
          'ڈراما دروازہ',
          'مکالمہ نگاری',
          'پلاٹ',
          'خلاصہ',
          'Urdu Drama'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Garam Coat — Short story (گرم کوٹ — افسانہ)',
        urduTitle: 'افسانہ گرم کوٹ — غربت اور خودداری کی داستان',
        author: 'Rajinder Singh Bedi',
        genre: 'Short Story (افسانہ)',
        url: 'https://youtu.be/3dj2bX5JnO0?si=IAWcvBQoY36JCiPb',
        videoId: '3dj2bX5JnO0',
        description: 'افسانہ گرم کوٹ کی تکنیک، شمیم کے کردار کی بے بسی و خودداری اور زندگی کی تلخ حقیقتوں کا بیان۔',
        keywords: [
          'Garam Coat',
          'Short story',
          'گرم کوٹ',
          'افسانہ',
          'کردار شمیم',
          'خلاصہ افسانہ',
          'Urdu Afsana'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Aadu — Short story (آڑو — افسانہ)',
        urduTitle: 'افسانہ آڑو — علامتی مفہوم اور تجزیہ',
        author: 'Urdu Afsana',
        genre: 'Short Story (افسانہ)',
        url: 'https://youtu.be/fQrWXvMDnik?si=Pi-39zUKtB27oSdR',
        videoId: 'fQrWXvMDnik',
        description: 'افسانہ آڑو کی کہانی، نفسیاتی پیچیدگیاں، علامتی مفاہیم اور امتحانی نکتہ نظر سے اہم سوالات۔',
        keywords: [
          'Aadu',
          'Short story',
          'آڑو',
          'افسانہ آڑو',
          'نفسیاتی پہلو',
          'سوال و جواب',
          'Urdu Literature'
        ]
      }
    ]
  },
  {
    id: 'other-prose',
    number: '3',
    name: 'Other Prose & Writing (دیگر اصناف نثر)',
    urduName: 'دیگر اصناف نثر و انشائیہ نگاری',
    description: 'سماجی مسائل پر مضامین، سفر نامہ نگاری کے مشاہدات، ظرافت و طنز و مزاح کے شاہکار، اور شخصیات پر خاکہ نگاری کے مکمل رہنما اسباق۔',
    color: 'from-indigo-600 to-purple-600',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Essays on social issues (سماجی مسائل پر مضامین)',
        urduTitle: 'سماجی مسائل پر مضمون نویسی',
        author: 'Social Essays',
        genre: 'Essay (مضمون)',
        url: 'https://youtu.be/ygSYtt7N6uY?si=gVDJNaUN67o8NTeb',
        videoId: 'ygSYtt7N6uY',
        description: 'تعلیمِ نسواں، ماحولیاتی تحفظ اور جدید معاشرتی مسائل پر معیاری مضمون نگاری کا طریقہ کار۔',
        keywords: [
          'Essays on social issues',
          'سماجی مسائل',
          'مضمون نگاری',
          'تعلیم نسواں',
          'انشائیہ',
          'Urdu Essay Writing'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Travel writing (سفر نامہ)',
        urduTitle: 'سفر نامہ نگاری — مشاہدات و منظر کشی',
        author: 'Travelogue',
        genre: 'Travelogue (سفر نامہ)',
        url: 'https://youtu.be/C9Vbv2_yaEo?si=DKWLweSbpLzW1Koz',
        videoId: 'C9Vbv2_yaEo',
        description: 'سفر نامے کے بنیادی عناصر، منظر نگاری کی نزاکتیں، سوانحی مشاہدات اور ممتاز سفر نامہ نگار۔',
        keywords: [
          'Travel writing',
          'سفر نامہ',
          'سیر و سیاحت',
          'منظر نگاری',
          'اردو سفر نامے',
          'مشاہدات',
          'Urdu Prose'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'Satire (طنز و مزاح)',
        urduTitle: 'اردو میں طنز و مزاح کا فن',
        author: 'Satire & Humour',
        genre: 'Satire (طنز و مزاح)',
        url: 'https://youtu.be/pUGBzGUYL4w?si=TwgCr99BQcmQB0-Q',
        videoId: 'pUGBzGUYL4w',
        description: 'طنز و مزاح میں تفریق، شائستگی، مزاحیہ اسلوب اور اردو کے مایہ ناز مزاح نگاروں کے نمونے۔',
        keywords: [
          'Satire',
          'طنز و مزاح',
          'مزاح نگاری',
          'ظرافت',
          'پطرس بخاری',
          'مشتاق احمد یوسفی',
          'Urdu Satire'
        ]
      },
      {
        id: '3-4',
        code: '3.4',
        title: 'Character sketches (خاکہ نگاری)',
        urduTitle: 'خاکہ نگاری — فن اور اہم شخصیات',
        author: 'Character Sketches',
        genre: 'Sketch (خاکہ نگاری)',
        url: 'https://youtu.be/grcX5RHdLZM?si=ftg_-8fqBvD2Kzlq',
        videoId: 'grcX5RHdLZM',
        description: 'خاکہ نگاری کا فن، کردار کی حقیقی عکاسی، جزئیات نگاری، اور مولوی عبدالحق کے چند ہم عصر۔',
        keywords: [
          'Character sketches',
          'خاکہ نگاری',
          'شخصیت نگاری',
          'مولوی عبد الحق',
          'چند ہم عصر',
          'Urdu Sketch Writing'
        ]
      }
    ]
  }
];

// =========================================================================
// ACADEMIC TRACKS & CURRICULUM MODULES
// =========================================================================
const ACADEMIC_MODULES = [
  {
    id: 'urdu-1st-year',
    name: '1st Year Junior Intermediate Urdu',
    urduTitle: 'سالِ اول — لازمی اردو نصاب',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    desc: 'Complete coverage of 1st Year Prose (نثر), Ghazals (غزلیات), Nazms (نظمیں), Grammar (قواعد), and Short Answer Writing for 100/100 marks.'
  },
  {
    id: 'urdu-2nd-year',
    name: '2nd Year Senior Intermediate Urdu',
    urduTitle: 'سالِ دوم — لازمی اردو نصاب',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    desc: 'Senior Inter Prose, Classic & Modern Ghazals, Non-detailed Afsana & Drama, Letter Writing, Application Drafts, and Board Blueprint Mastery.'
  },
  {
    id: 'urdu-poetry-mastery',
    name: 'Poetry & Tashreeh Masterclass',
    urduTitle: 'شاعری، تشریح اور فہمِ کلام',
    category: 'Classical & Modern Poetry',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
    desc: 'Line-by-line Tashreeh of Mirza Ghalib, Allama Iqbal, Faiz, and Hasrat Mohani with exact marks-scoring format for board examinations.'
  },
  {
    id: 'urdu-prose-drama',
    name: 'Prose, Drama & Fiction Analysis',
    urduTitle: 'نثر، ناول، ڈراما اور افسانہ نگاری',
    category: 'Prose & Drama',
    image: 'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?q=80&w=600&auto=format&fit=crop',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    desc: 'In-depth character analysis of Prem Chand’s Nirmala, Drama Darwaza, Garam Coat, and Aadu short stories with model answer scripts.'
  },
  {
    id: 'urdu-grammar-syntax',
    name: 'Grammar, Qawaid & Syntax',
    urduTitle: 'اردو قواعد، بلاغت و املا',
    category: 'Core Language',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    desc: 'Master Ism, Zameer, Sifat, Fail, Sana-e-Badae (Tashbeeh, Istiara, Talmeeh, Tajnees), sentence correction, and vocabulary drills without cramming.'
  },
  {
    id: 'urdu-creative-writing',
    name: 'Essay, Travelogue & Satire Writing',
    urduTitle: 'مضمون نگاری، سفر نامہ و خاکہ نگاری',
    category: 'Expressive Composition',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    desc: 'High-scoring essay templates on contemporary issues, travelogue frameworks, satire comprehension, and character sketches for exams.'
  }
];

export default function UrduCurriculum({ onEnroll }) {
  const [activeView, setActiveView] = useState('lectures'); // 'lectures' | 'modules'
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [dbVideos, setDbVideos] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Module interaction state
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  // Fetch optional published videos from DB for Urdu
  const loadDbVideos = useCallback(() => {
    setIsLoadingDb(true);
    fetchStudentVideos({ subject: 'Urdu' })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbVideos(data);
        }
      })
      .catch((err) => console.warn('Could not load database videos for Urdu:', err))
      .finally(() => setIsLoadingDb(false));
  }, []);

  useEffect(() => {
    loadDbVideos();
  }, [loadDbVideos]);

  // Merge static topics with any DB uploaded videos
  const topicsData = useMemo(() => {
    const chapters = RAW_TOPICS_DATA.map((ch) => ({
      ...ch,
      videos: [...(ch.videos || [])]
    }));

    if (!dbVideos || dbVideos.length === 0) {
      return chapters;
    }

    dbVideos.forEach((v, idx) => {
      const vYtId = v.youtubeId || extractYouTubeId(v.url);
      const isAlreadyIncluded = chapters.some((c) =>
        c.videos.some((vid) => (vid.url && vid.url === v.url) || (vid.videoId && vid.videoId === vYtId))
      );
      if (isAlreadyIncluded) return;

      const rawChapter = (v.chapterName || v.chapter || '').toLowerCase();
      let targetChapter = chapters.find((c) => c.name.toLowerCase().includes(rawChapter));
      if (!targetChapter) {
        targetChapter = chapters[0];
      }

      const videoNode = {
        id: v._id ? `db-${v._id}` : `db-${idx}`,
        code: `${targetChapter.number}.${targetChapter.videos.length + 1}`,
        title: v.title,
        urduTitle: v.titleUrdu || v.title,
        author: v.author || 'Faculty Lecture',
        genre: v.genre || 'Video Lecture',
        url: v.url,
        videoId: vYtId,
        description: v.description || 'Comprehensive board video lecture with detailed concept explanations.',
        keywords: Array.isArray(v.keywords) ? v.keywords : ['Urdu', 'Video Lecture', targetChapter.name],
        isDbUploaded: true
      };

      targetChapter.videos.push(videoNode);
    });

    return chapters;
  }, [dbVideos]);

  // Flatten all videos for quick searching
  const allVideos = useMemo(() => {
    return topicsData.flatMap((topic) =>
      topic.videos.map((v) => ({
        ...v,
        topicId: topic.id,
        topicNumber: topic.number,
        topicName: topic.name,
        topicUrduName: topic.urduName,
        topicBadgeColor: topic.badgeColor
      }))
    );
  }, [topicsData]);

  // Filter videos by topic filter and search query
  const filteredVideos = useMemo(() => {
    let list = allVideos;

    if (selectedTopicId !== 'all') {
      list = list.filter((v) => v.topicId === selectedTopicId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        (v.urduTitle && v.urduTitle.toLowerCase().includes(q)) ||
        v.code.toLowerCase().includes(q) ||
        v.topicName.toLowerCase().includes(q) ||
        (v.author && v.author.toLowerCase().includes(q)) ||
        (v.genre && v.genre.toLowerCase().includes(q)) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        v.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allVideos, selectedTopicId, searchQuery]);

  const currentVideoIndex = activeVideo
    ? filteredVideos.findIndex((v) => v.id === activeVideo.id)
    : -1;

  const handleNextVideo = () => {
    if (currentVideoIndex >= 0 && currentVideoIndex < filteredVideos.length - 1) {
      setActiveVideo(filteredVideos[currentVideoIndex + 1]);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setActiveVideo(filteredVideos[currentVideoIndex - 1]);
    }
  };

  // Keyboard navigation for active video modal
  useEffect(() => {
    if (!activeVideo) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveVideo(null);
      if (e.key === 'ArrowRight') handleNextVideo();
      if (e.key === 'ArrowLeft') handlePrevVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, currentVideoIndex, filteredVideos]);

  const isSearching = searchQuery.trim().length > 0;

  // Render individual curriculum module card
  const renderModuleCard = (mod) => {
    const isEnrolling = activeEnroll === mod.id;
    const isExploring = activeExplore === mod.id;

    return (
      <div key={mod.id} className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 h-[380px] group hover:-translate-y-1 relative">
        <div 
          className="h-40 w-full overflow-hidden relative shrink-0 cursor-pointer"
          onClick={() => setActiveExplore(mod.id)}
        >
          <img src={mod.image} alt={mod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white shadow-sm">
            <BookOpen size={20} />
          </div>
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-medium">
            {mod.urduTitle}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
            {mod.category}
          </div>
          <h4 
            className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
            onClick={() => setActiveExplore(mod.id)}
          >
            {mod.name}
          </h4>

          {/* Default View */}
          <div className={`flex flex-col mt-auto transition-opacity duration-300 ${isExploring || isEnrolling ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {mod.desc}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveExplore(mod.id)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Info size={14} /> Explore
              </button>
              <button 
                onClick={() => setActiveEnroll(mod.id)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                Enroll <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Explore View */}
          <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isExploring ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{mod.name}</h4>
              <span className="text-xs text-emerald-600 font-bold font-serif">{mod.urduTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed overflow-y-auto pr-1 mb-4 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {mod.desc}
            </p>
            <button 
              onClick={() => setActiveExplore(null)}
              className="w-full mt-auto py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} /> Back
            </button>
          </div>

          {/* Enroll View */}
          <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isEnrolling ? 'translate-y-0' : 'translate-y-full'}`}>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 text-center">Select Batch Track</h4>
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - Regular Intermediate Board Batch`);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                Regular Board Batch (100 Marks)
              </button>
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - 100/100 Intensive Score Booster`);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-indigo-500/20"
              >
                100/100 Fast-Track Intensive Booster
              </button>
            </div>
            <button 
              onClick={() => setActiveEnroll(null)}
              className="w-full mt-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="urdu-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            SECTION HEADER
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-4 border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs">
            <Tv size={15} />
            <span>AP & TS Intermediate Urdu Video Lectures</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Urdu Chapter-Wise Video Lectures
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed">
            منظومات و غزلیات (مرزا غالب، فیض، اقبال)، نثری اسباق (ناول نرملا، ڈراما دروازہ، افسانہ گرم کوٹ و آڑو)، اور مضامین و خاکہ نگاری کے مکمل ویڈیو اسباق۔
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures (اردو ڈیمو اسباق)
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  These are curated sample demo lectures. <strong>Enroll now</strong> to get full access to detailed all chapters, solved question banks, tashreeh notes, and live 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Urdu Full Course - All Chapters Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* View Mode Toggle: Video Lectures vs Syllabus Modules */}
          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveView('lectures')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'lectures'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Tv size={15} />
              <span>Video Lectures ({allVideos.length})</span>
            </button>
            <button
              onClick={() => setActiveView('modules')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'modules'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen size={15} />
              <span>Syllabus Modules ({ACADEMIC_MODULES.length})</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            VIEW 1: CHAPTER-WISE VIDEO LECTURES (DEFAULT)
            ========================================================================= */}
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
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All Topics ({allVideos.length})
                </button>
                {topicsData.map((topic) => {
                  const isActive = selectedTopicId === topic.id && !isSearching;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
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
                  placeholder="Search topic or poet (e.g. Ghazals, Mirza Ghalib, Nirmala, Drama, Coat...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400 shadow-xs"
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
              <div className="mb-6 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-medium">
                  <Search size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Found <strong className="font-bold text-emerald-700 dark:text-emerald-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'lesson' : 'lessons'} for "<em>{searchQuery}</em>"
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  Clear filter <X size={12} />
                </button>
              </div>
            )}

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching Urdu lessons found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                  Try searching with keywords like <strong>Ghazal</strong>, <strong>Mirza Ghalib</strong>, <strong>Faiz</strong>, <strong>Nirmala</strong>, <strong>Drama</strong>, or <strong>Satire</strong>.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Search & View All ({allVideos.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => {
                  const hasVideo = Boolean(video.videoId);
                  const thumbnailUrl = hasVideo 
                    ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                    : null;

                  return (
                    <div
                      key={video.id}
                      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1"
                    >
                      {/* Video Thumbnail Container */}
                      <div 
                        onClick={() => {
                          if (hasVideo) setActiveVideo(video);
                        }}
                        className={`relative aspect-video w-full overflow-hidden bg-slate-950 ${hasVideo ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {hasVideo ? (
                          <>
                            <img
                              src={thumbnailUrl}
                              alt={video.title}
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/90 transition-all" />

                            {/* Centered Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
                                <Play size={20} className="fill-white ml-0.5" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 text-center">
                            <Clock size={28} className="text-emerald-400 mb-2 animate-pulse" />
                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Video Lecture Coming Soon</span>
                            <span className="text-[11px] text-slate-400 mt-1">Recording in studio</span>
                          </div>
                        )}

                        {/* Topic Code Badge */}
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/10">
                          {video.code}
                        </div>

                        {/* Author / Genre Tag */}
                        {video.author && (
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-emerald-600/85 backdrop-blur-md text-white text-[10px] font-bold shadow-xs">
                            {video.author}
                          </div>
                        )}

                        {video.genre && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-medium border border-emerald-500/30">
                            {video.genre}
                          </div>
                        )}
                      </div>

                      {/* Video Content Details */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        {/* Topic Pill */}
                        <div className="mb-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${video.topicBadgeColor}`}>
                            {video.topicName}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 
                          onClick={() => {
                            if (hasVideo) setActiveVideo(video);
                          }}
                          className={`text-base font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2 transition-colors ${hasVideo ? 'cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400' : ''}`}
                        >
                          {video.title}
                        </h3>

                        {/* Urdu Subtitle / Description */}
                        {video.urduTitle && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif mb-2 line-clamp-1" dir="rtl">
                            {video.urduTitle}
                          </p>
                        )}

                        {/* Short Description */}
                        {video.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                            {video.description}
                          </p>
                        )}

                        {/* Keywords Tag Pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto pt-2">
                          {video.keywords.slice(0, 3).map((kw, i) => (
                            <button
                              key={i}
                              onClick={() => setSearchQuery(kw)}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                            >
                              #{kw}
                            </button>
                          ))}
                          {video.keywords.length > 3 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{video.keywords.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {hasVideo ? (
                            <>
                              <button
                                onClick={() => setActiveVideo(video)}
                                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shadow-emerald-600/20"
                              >
                                <Play size={13} className="fill-white" />
                                <span>Watch Lecture</span>
                              </button>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                                title="Open on YouTube"
                              >
                                <ExternalLink size={14} />
                              </a>
                            </>
                          ) : (
                            <button
                              onClick={() => onEnroll && onEnroll(`Request Chapter: ${video.code} ${video.title}`)}
                              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Clock size={13} />
                              <span>Request Notes / Lecture</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom 1-on-1 Guidance & Live Tuition CTA Banner */}
            <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
                    <Feather size={14} />
                    <span>Complete AP & TS Board Urdu Preparation</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2">
                    Need Full Chapter Notes, Tashreeh & 1-on-1 Doubt Clarification?
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Get full access to all Poetry Tashreeh blueprints, Munshi Prem Chand’s Nirmala chapter breakdowns, solved drama dialogues, grammar workbooks, and board exam answer-writing masterclasses to score a guaranteed 100/100.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => onEnroll && onEnroll('Urdu 1-on-1 Live Doubt & Board Coaching')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-600/25 cursor-pointer"
                  >
                    <span>Book 1-on-1 Doubt Session</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
             VIEW 2: ACADEMIC CURRICULUM MODULES
             ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ACADEMIC_MODULES.map(renderModuleCard)}
          </div>
        )}

      </div>

      {/* =========================================================================
          EMBEDDED YOUTUBE VIDEO PLAYER MODAL
          ========================================================================= */}
      {activeVideo && activeVideo.videoId && (
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
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 shrink-0">
                  Topic {activeVideo.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeVideo.title} {activeVideo.author ? `— ${activeVideo.author}` : ''}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeVideo.url && (
                  <a
                    href={activeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span className="hidden sm:inline">YouTube</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Responsive 16:9 YouTube Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
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
                  if (onEnroll) onEnroll(`Urdu Help: Topic ${current.code} - ${current.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
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
