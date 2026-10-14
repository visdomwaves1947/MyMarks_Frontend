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
    name: 'Prose (గద్యభాగం)',
    description: 'హాసము - హాస్యము తత్త్వం, సమకాలీన సామాజిక ఆలోచనలు, మాటతీరు సంభాషణ కళ, మరియు కందుకూరి సంస్కరణోద్యమ పాఠాల సమగ్ర విశ్లేషణ.',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'Hasamu – Hasyamu (హాసము - హాస్యము)',
        url: 'https://youtu.be/JLBxx7xjd4g?si=VR6XEu5S0suIFS9r',
        videoId: 'JLBxx7xjd4g',
        keywords: [
          'Hasamu – Hasyamu',
          'హాసము - హాస్యము',
          'lesson explanation',
          'Telugu prose summary',
          'author details',
          'question answers',
          'important questions'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Appudu Putti Unte (అప్పుడు పుట్టి ఉంటే)',
        url: 'https://youtu.be/o_U0C9NjzQs?si=kg-wVFjobNIKsL6c',
        videoId: 'o_U0C9NjzQs',
        keywords: [
          'Appudu Putti Unte',
          'అప్పుడు పుట్టి ఉంటే',
          'lesson explanation',
          'Telugu prose summary',
          'author details',
          'question answers',
          'important questions'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Maata Theeru (మాట తీరు)',
        url: 'https://youtu.be/24g33jofpEs?si=IbEUiPpCvVwaazEv',
        videoId: '24g33jofpEs',
        keywords: [
          'Maata Theeru',
          'మాట తీరు',
          'lesson explanation',
          'Telugu prose summary',
          'author details',
          'question answers',
          'important questions'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Mahilodyama Janakudu Kandukuri (మహిళోద్యమ జనకుడు కందుకూరి)',
        url: 'https://youtu.be/L7wo24S4Wt0?si=FRocQ5TxlrYD2DFz',
        videoId: 'L7wo24S4Wt0',
        keywords: [
          'Mahilodyama Janakudu Kandukuri',
          'మహిళోద్యమ జనకుడు కందుకూరి',
          'lesson explanation',
          'Kandukuri Veeresalingam',
          'కందుకూరి వీరేశలింగం',
          'Telugu prose summary',
          'question answers',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'poetry',
    number: '2',
    name: 'Poetry (పద్యభాగం)',
    description: 'ధర్మ పరీక్ష, భక్త కన్నప్ప ముగ్ధభక్తి, జాషువా గారి శ్మశాన వాటిక తాత్త్వికత, మరియు దేశభక్తి గీతాల ప్రతిపదార్థ తాత్పర్యాలు, విశేషాంశాలు.',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Dharma Pariksha (ధర్మ పరీక్ష)',
        url: 'https://youtu.be/Gm0Gv4YZbUo?si=8I4-JGve22ZjiCou',
        videoId: 'Gm0Gv4YZbUo',
        keywords: [
          'Dharma Pariksha',
          'ధర్మ పరీక్ష',
          'poem explanation',
          'summary',
          'poet details',
          'important questions',
          'prathipadardham'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Thinnani Mugdha Bhakti (తిన్నని ముగ్ధ భక్తి)',
        url: 'https://youtu.be/fuIaWw9-bZ8?si=u_QFnoq1SbgtixUI',
        videoId: 'fuIaWw9-bZ8',
        keywords: [
          'Thinnani Mugdha Bhakti',
          'తిన్నని ముగ్ధ భక్తి',
          'Bhakta Kannappa',
          'poem explanation',
          'summary',
          'poet details',
          'important questions'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Smashana Vaati (శ్మశాన వాటి)',
        url: 'https://youtu.be/ytod5GxbZ6E?si=aqeRr9NKgTjRGRMS',
        videoId: 'ytod5GxbZ6E',
        keywords: [
          'Smashana Vaati',
          'శ్మశాన వాటి',
          'Gurram Jashua',
          'జాషువా',
          'poem explanation',
          'summary',
          'poet details',
          'important questions'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Cheyyathi Jayakottu (చెయ్యెత్తి జైకొట్టు)',
        url: 'https://youtu.be/XAjxSKQ_SDw?si=evEVcnLjZpWiPmUO',
        videoId: 'XAjxSKQ_SDw',
        keywords: [
          'Cheyyathi Jayakottu',
          'చెయ్యెత్తి జైకొట్టు',
          'poem explanation',
          'summary',
          'poet details',
          'central idea',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'non-detailed',
    number: '3',
    name: 'Non-Detailed (ఉపవాచకం)',
    description: 'కుంకుడాకు, ఊతకర్ర, సౌందర్యం వంటి హృద్యమైన తెలుగు కథానికల పాత్ర చిత్రణలు, ఇతివృత్తం, శీర్షిక ఔచిత్యం మరియు ప్రశ్న జవాబులు.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Kumkudaaku (కుంకుడాకు)',
        url: 'https://youtu.be/ZY3WPOUg7pg?si=4gMH_scMNc3uLBAK',
        videoId: 'ZY3WPOUg7pg',
        keywords: [
          'Kumkudaaku',
          'కుంకుడాకు',
          'story explanation',
          'Telugu story summary',
          'characters',
          'theme',
          'title significance',
          'question answers'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Ootha Karra (ఊతకర్ర)',
        url: 'https://youtu.be/Lpw4accYXSE?si=5h8Hg2XLalJq4g3i',
        videoId: 'Lpw4accYXSE',
        keywords: [
          'Ootha Karra',
          'ఊతకర్ర',
          'story explanation',
          'Telugu story summary',
          'characters',
          'theme',
          'title significance',
          'question answers'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'Soundaryam (సౌందర్యం)',
        url: 'https://youtu.be/ZtOSm80fnqc?si=Wb8-zImy5fopRd5G',
        videoId: 'ZtOSm80fnqc',
        keywords: [
          'Soundaryam',
          'సౌందర్యం',
          'story explanation',
          'Telugu story summary',
          'characters',
          'theme',
          'title significance',
          'question answers'
        ]
      }
    ]
  },
  {
    id: 'literature-history',
    number: '4',
    name: 'Literature History (సాహిత్య చరిత్ర)',
    description: 'కవిత్రయ యుగం (నన్నయ, తిక్కన, ఎర్రన), శివకవి యుగం (పాల్కురికి సోమనాథుడు), ప్రబంధ యుగపు శ్రీనాథుడు, భక్తి యుగపు బమ్మెర పోతన సమగ్ర సాహిత్య విశేషాలు.',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Nannaya (ఆదికవి నన్నయ)',
        url: 'https://youtu.be/VlvRJ09KCsM?si=0x26ATUIbAnlfxR7',
        videoId: 'VlvRJ09KCsM',
        keywords: [
          'Nannaya',
          'నన్నయ',
          'Adikavi Nannaya',
          'Telugu literary history',
          'life and works',
          'literary contributions',
          'exam questions'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'Tikkana (కవిబ్రహ్మ తిక్కన)',
        url: 'https://youtu.be/SpmqRiBRiqM?si=kfcHPwZsJkoW3rR_',
        videoId: 'SpmqRiBRiqM',
        keywords: [
          'Tikkana',
          'తిక్కన',
          'Telugu literary history',
          'life and works',
          'Mahabharatam',
          'literary contributions',
          'exam questions'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'Errana (ప్రబంధ పరమేశ్వర ఎర్రన)',
        url: 'https://youtu.be/Fv-rlZqj9ik?si=5Lf06KEFUvylgGOl',
        videoId: 'Fv-rlZqj9ik',
        keywords: [
          'Errana',
          'ఎర్రన',
          'Telugu literary history',
          'life and works',
          'Kavitrayam',
          'literary contributions',
          'exam questions'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'Palkuriki Somanatha (పాల్కురికి సోమనాథుడు)',
        url: 'https://youtu.be/3V0igHz7D9M?si=KPU8MpT20g6_kZai',
        videoId: '3V0igHz7D9M',
        keywords: [
          'Palkuriki Somanatha',
          'పాల్కురికి సోమనాథుడు',
          'life and works',
          'Telugu literary history',
          'Basava Purana',
          'literary contributions',
          'exam questions'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'Srinatha (కవిసార్వభౌమ శ్రీనాథుడు)',
        url: 'https://youtu.be/Se4DvhJy6_E?si=XJLoof-QCaobwTQs',
        videoId: 'Se4DvhJy6_E',
        keywords: [
          'Srinatha',
          'శ్రీనాథుడు',
          'Telugu literary history',
          'life and works',
          'literary contributions',
          'important works',
          'exam questions'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'Potana (బమ్మెర పోతన)',
        url: 'https://youtu.be/g0KA6PGckQg?si=OZIBA7pht5YyRYXw',
        videoId: 'g0KA6PGckQg',
        keywords: [
          'Potana',
          'పోతన',
          'Bammera Potana',
          'Telugu literary history',
          'life and works',
          'Andhra Maha Bhagavatam',
          'literary contributions',
          'exam questions'
        ]
      }
    ]
  }
];

// Helper to normalize strings for flexible, resilient search (supports English & Telugu Unicode)
const normalize = (str) => 
  (str || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, ' ')
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
    id: 'tel-1st-year',
    name: '1st Year Junior Telugu (ప్రథమ సంవత్సరం)',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    desc: 'గద్యభాగం, పద్యభాగం, ఉపవాచకం, వ్యాకరణం (సంధులు, సమాసాలు), సాహిత్య చరిత్ర పాఠాల సమగ్ర శిక్షణ for 100/100 marks.'
  },
  {
    id: 'tel-2nd-year',
    name: '2nd Year Senior Telugu (ద్వితీయ సంవత్సరం)',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600&auto=format&fit=crop',
    desc: 'సీనియర్ ఇంటర్ ప్రాచీన & ఆధునిక కవిత్వం, నాటక విభాగాలు, ఛందస్సు, అలంకారాలు, మరియు లేఖారచనలు.'
  },
  {
    id: 'tel-grammar',
    name: 'Telugu Vyakaranam & Chandassu (వ్యాకరణం & ఛందస్సు)',
    category: 'Core Language',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    desc: 'సంధులు (సవర్ణదీర్ఘ, గుణ, వృద్ధి, యణాదేశ), సమాసాలు, శబ్దాలంకారాలు, అర్థాలంకారాలు, ఉత్పలమాల, చంపకమాల రీతులు.'
  },
  {
    id: 'tel-prathipadardham',
    name: 'Prathipadardham & Taatparyam (ప్రతిపదార్థాలు & భావాలు)',
    category: 'Poetry Analysis',
    image: 'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?q=80&w=600&auto=format&fit=crop',
    desc: 'బోర్డు పరీక్షల్లో పూర్తి మార్కులు సాధించేలా పద్యాల ప్రతిపదార్థ తాత్పర్యాల రాత పద్ధతి, సందర్భ సహిత వాక్యాలు.'
  },
  {
    id: 'tel-sahitya-charitra',
    name: 'Sahitya Charitra Mastery (సాహిత్య చరిత్ర)',
    category: 'Literary History',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    desc: 'నన్నయ, తిక్కన, ఎర్రన కవిత్రయం, పాల్కురికి సోమనాథుడు, శ్రీనాథుడు, పోతన యుగాల చారిత్రక సాహిత్య పరిణామం.'
  },
  {
    id: 'tel-stories',
    name: 'Non-Detailed Stories (ఉపవాచక కథానికలు)',
    category: 'Short Stories',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop',
    desc: 'కుంకుడాకు, ఊతకర్ర, సౌందర్యం వంటి ఉపవాచక కథల పాత్ర చిత్రణలు, సందేశం, మరియు బోర్డు ప్రశ్నల సమాధానాలు.'
  },
  {
    id: 'tel-board-booster',
    name: '100/100 Board Presentation Blueprint',
    category: 'Exam Strategy',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    desc: 'ప్రశ్న పత్రం విశ్లేషణ, సమయ నిర్వహణ, వ్యాకరణం సులభ పద్ధతులు, మరియు మునుపటి బోర్డు ప్రశ్న పత్రాల సాధన.'
  }
];

export default function TeluguCurriculum({ onEnroll }) {
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
    <section id="telugu-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-4 border border-amber-200/80 dark:border-amber-800/80 shadow-xs">
            <Tv size={15} />
            <span>AP & TS Intermediate Telugu Video Lectures & Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Telugu Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            గద్యభాగం, పద్యభాగ ప్రతిపదార్థాలు, ఉపవాచక కథానికలు, మరియు నన్నయ-పోతన సాహిత్య చరిత్ర పాఠాల సమగ్ర వీడియో వివరణలు.
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures (నమూనా డెమో తరగతులు)
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  ఇవి నమూనా డెమో వీడియోలు మాత్రమే. <strong>ఇప్పుడే నమోదు చేసుకోండి</strong> - పూర్తి పద్య భావాలు, సందర్భ సహిత వాక్యాలు, వ్యాకరణం మరియు 1-on-1 డౌట్ క్లియరింగ్ పొందండి!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Telugu Full Course - Complete 1st Year Access')}
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
                  placeholder="శోధించండి (e.g. Hasamu, Dharma Pariksha, Nannaya, పోతన, కందుకూరి...)"
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">వీడియోలు లభించలేదు (No lectures found)</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                  కీవర్డ్‌లతో శోధించండి: <strong>నన్నయ</strong>, <strong>ధర్మ పరీక్ష</strong>, <strong>హాసము</strong>, <strong>కందుకూరి</strong>, లేదా <strong>పోతన</strong>.
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
                  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

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
                          <span>YouTube Lecture</span>
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
                            title="Open on YouTube"
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
                      onClick={() => onEnroll && onEnroll(`Telugu: ${mod.name}`)}
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
                <span>Live 1-on-1 Telugu Faculty Mentorship</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                తెలుగు సాహిత్యం & వ్యాకరణంలో సందేహాలు ఉన్నాయా?
              </h3>
              <p className="text-amber-200/80 text-sm sm:text-base max-w-2xl">
                పద్య ప్రతిపదార్థాలు, సందర్భ సహిత వాక్యాలు, సంధులు, సమాసాలు, మరియు బోర్డు పరీక్షల్లో 100/100 సాధించేందుకు ప్రత్యక్ష మార్గదర్శనం పొందండి.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Telugu 1-on-1 Live Doubt & Board Coaching')}
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
                  if (onEnroll) onEnroll(`Telugu Help: Topic ${current.code} - ${current.title}`);
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
