import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  Scroll,
  Landmark,
  Compass,
  Clock,
  ShieldCheck,
  Info,
  Calendar,
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
// PRESCRIBED HISTORY CHAPTER-WISE VIDEO LECTURES & KEYWORDS DATA
// =========================================================================
const RAW_TOPICS_DATA = [
  {
    id: 'what-is-history',
    number: '1',
    name: 'What Is History?',
    chapterTitle: '1. What Is History?',
    period: 'Foundations & Historiography',
    description: 'Definition and scope of history, historiography, objectivity in historical writing, history as science or humanities, geographical influences on historical events, and classification of historical sources.',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '1-0',
        code: '1.0',
        title: 'What Is History?',
        chapterTitle: '1. What Is History?',
        topicName: 'What Is History?',
        url: 'https://youtu.be/gkdzu8X84fo?si=pqwiJrMntGVBgE29',
        videoId: 'gkdzu8X84fo',
        description: 'Comprehensive foundational masterclass on the meaning and scope of History, historical methodology, objectivity, debate on History as a science or humanities, role of geography, and primary & secondary sources.',
        keywords: [
          'What Is History?',
          'Definition and scope',
          'Historiography',
          'Historical objectivity',
          'History as science or humanities',
          'Geographical factors in history',
          'Historical sources',
          'Primary sources',
          'Secondary sources',
          'Archaeological sources',
          'Literary sources',
          'Epigraphy and Numismatics'
        ]
      }
    ]
  },
  {
    id: 'ancient-civilisations-cultures',
    number: '2',
    name: 'Ancient Civilisations and Cultures',
    chapterTitle: '2. Ancient Civilisations and Cultures',
    period: 'Bronze Age & Vedic Period',
    description: 'Pre-Harappan cultures, Harappan civilization and undeciphered script, town planning, drainage systems, social and economic structures, Early Vedic Age, and post-Vedic culture.',
    color: 'from-orange-600 to-amber-700',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    videos: [
      {
        id: '2-0',
        code: '2.0',
        title: 'Ancient Civilisations and Cultures',
        chapterTitle: '2. Ancient Civilisations and Cultures',
        topicName: 'Ancient Civilisations and Cultures',
        url: 'https://youtu.be/Kepp9g9Ccqk?si=L3wXVJHSlhFXkrvx',
        videoId: 'Kepp9g9Ccqk',
        description: 'In-depth exploration of Pre-Harappan traditions, Indus Valley civilization, town planning, the Citadel, Great Bath, drainage network, script, seals, economy, Rigvedic society, and Later Vedic transformation.',
        keywords: [
          'Ancient Civilisations and Cultures',
          'Pre-Harappan cultures',
          'Harappan civilisation',
          'Harappan script and seals',
          'Town planning',
          'Citadel and Great Bath',
          'Drainage system',
          'Harappan society and economy',
          'Vedic Age',
          'Rigvedic society',
          'Post-Vedic culture',
          'Later Vedic literature'
        ]
      }
    ]
  },
  {
    id: 'early-states-empires-economy',
    number: '3',
    name: 'Early States, Empires and Economy',
    chapterTitle: '3. Early States, Empires and Economy',
    period: '6th Century BC Urbanisation',
    description: 'Emergence of early territorial states, the sixteen Mahajanapadas, rise of Magadhan supremacy, agrarian expansion, rural economy, trade routes, guild systems, and the second urbanisation.',
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '3-0',
        code: '3.0',
        title: 'Early States, Empires and Economy',
        chapterTitle: '3. Early States, Empires and Economy',
        topicName: 'Early States, Empires and Economy',
        url: 'https://youtu.be/uW7uEScfYYI?si=z4CNOV2K_WzadDrX',
        videoId: 'uW7uEScfYYI',
        description: 'Complete analysis of the 6th century BC political landscape, sixteen Mahajanapadas, Bimbisara and Ajatashatru, Magadhan imperial dominance, rural agricultural life, trade guilds (Shrenis), and early currency.',
        keywords: [
          'Early States, Empires and Economy',
          'Early states',
          'Sixteen Mahajanapadas',
          'Rise of Magadha',
          'Bimbisara and Ajatashatru',
          'Rural life and agriculture',
          'Trade routes and Shrenis',
          'Second urbanisation',
          'Early Indian economy',
          'Punch-marked coins'
        ]
      }
    ]
  },
  {
    id: 'early-societies-religious-movements',
    number: '4',
    name: 'Early Societies and Religious Movements',
    chapterTitle: '4. Early Societies and Religious Movements',
    period: 'Socio-Religious Reform',
    description: 'Kinship ties, marriage regulations, social stratification and varna-jati system, and the rise of heterodox religious movements including Ajivikas, Lokayatas (Charvaka), Jainism, and Buddhism.',
    color: 'from-teal-600 to-cyan-700',
    badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    videos: [
      {
        id: '4-0',
        code: '4.0',
        title: 'Early Societies and Religious Movements',
        chapterTitle: '4. Early Societies and Religious Movements',
        topicName: 'Early Societies and Religious Movements',
        url: 'https://youtu.be/cLn_bRa90Q8?si=rdXGRfLoLj0FWOgw',
        videoId: 'cLn_bRa90Q8',
        description: 'Examines ancient kinship, gotra rules, marriage customs, social inequalities, caste origins, and philosophical challenges by Vardhamana Mahavira (Jainism), Gautama Buddha, Ajivikas, and materialist Lokayatas.',
        keywords: [
          'Early Societies and Religious Movements',
          'Kinship and marriage',
          'Social and class differences',
          'Varna and Jati system',
          'Heterodox religious movements',
          'Ajivikas and Makkhali Gosala',
          'Lokayatas and Charvaka philosophy',
          'Jainism and Vardhamana Mahavira',
          'Buddhism and Gautama Buddha',
          'Four Noble Truths and Eightfold Path',
          'Buddhist Sangha and Monasteries'
        ]
      }
    ]
  },
  {
    id: 'polity-economy-society-culture-3bc-7ad',
    number: '5',
    name: 'Polity, Economy, Society and Culture (3rd Century BC to 7th Century AD)',
    chapterTitle: '5. Polity, Economy, Society and Culture (3rd BC to 7th AD)',
    period: 'Classical & Imperial Era',
    description: 'Historical sources, Mauryas and post-Mauryan polities, Ashoka Dhamma and edicts, Kushanas, Gupta classical era, Pushyabhuti dynasty of Harshavardhana, administrative machinery, economy, and classical art.',
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '5-0',
        code: '5.0',
        title: 'Polity, Economy, Society and Culture from 3rd Century BC to 7th Century AD',
        chapterTitle: '5. Polity, Economy, Society and Culture (3rd BC to 7th AD)',
        topicName: 'Polity, Economy, Society and Culture (3rd BC to 7th AD)',
        url: 'https://youtu.be/5rYMCUfMlhE?si=suDi-KrPA8_X7spo',
        videoId: '5rYMCUfMlhE',
        description: 'Comprehensive study of the Mauryan Empire (Chandragupta, Kautilya, Ashoka), post-Mauryan Shungas and Kushanas, the Gupta Golden Age (Samudragupta, Chandragupta II), Harsha Vardhana, and classical cultural achievements.',
        keywords: [
          'Polity, Economy, Society and Culture from 3rd Century BC to 7th Century AD',
          'Historical sources',
          'Mauryas and post-Mauryan states',
          'Ashoka Dhamma and rock edicts',
          'Kushanas and Kanishka',
          'Gupta period Golden Age',
          'Samudragupta and Chandragupta II',
          'Pushyabhuti dynasty',
          'Harshavardhana and Kannauj Assembly',
          'Ancient administration and taxation',
          'Gupta economy and society',
          'Classical art, sculpture and architecture'
        ]
      }
    ]
  },
  {
    id: 'deccan-south-india-up-to-10th-century',
    number: '6',
    name: 'Deccan and South India up to 10th Century AD',
    chapterTitle: '6. Deccan and South India up to 10th Century AD',
    period: 'Sangam & Early Deccan',
    description: 'Deccan historical sources, Sangam literature and heroic society, Satavahana empire of Andhra, Chalukyas of Badami, Pallavas of Kanchi, Rashtrakutas, maritime commerce, and early Dravidian rock-cut temple architecture.',
    color: 'from-indigo-600 to-violet-700',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '6-0',
        code: '6.0',
        title: 'Deccan and South India up to 10th Century AD',
        chapterTitle: '6. Deccan and South India up to 10th Century AD',
        topicName: 'Deccan and South India up to 10th Century AD',
        url: 'https://youtu.be/9E-PfYdp1fk?si=qQ953r0syRlNwU2z',
        videoId: '9E-PfYdp1fk',
        description: 'Masterclass on South Indian antiquity: Sangam poetic anthologies, Satavahana rulers (Gautamiputra Satakarni), trade with the Roman Empire, Badami Chalukyas, Mahabalipuram Pallava rock temples, and Rashtrakuta Kailasa temple.',
        keywords: [
          'Deccan and South India up to 10th Century AD',
          'Deccan historical sources',
          'Sangam literature and Sangam Age',
          'Satavahanas of Andhra',
          'Gautamiputra Satakarni and Nasik Inscription',
          'Deccan kingdoms',
          'Chalukyas of Badami',
          'Pallavas of Kanchi',
          'Rashtrakutas and Kailasa Temple',
          'Religion and society in South India',
          'Maritime trade with Rome',
          'Rock-cut temples and Dravidian architecture'
        ]
      }
    ]
  },
  {
    id: 'age-of-delhi-sultanate',
    number: '7',
    name: 'Age of Delhi Sultanate (1206–1526 AD)',
    chapterTitle: '7. Age of Delhi Sultanate (1206–1526 AD)',
    period: 'Medieval Sultanates',
    description: 'Arab conquest of Sindh, Turkish invasions (Mahmud Ghazni, Muhammad Ghori), dynasties of Delhi Sultanate (Slave, Khilji, Tughlaq, Sayyid, Lodi), administrative reforms, market regulations, economy, and Indo-Islamic architecture.',
    color: 'from-rose-600 to-red-700',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '7-0',
        code: '7.0',
        title: 'Age of Delhi Sultanate (1206–1526 AD)',
        chapterTitle: '7. Age of Delhi Sultanate (1206–1526 AD)',
        topicName: 'Age of Delhi Sultanate (1206–1526 AD)',
        url: 'https://www.youtube.com/live/XF_dbbzXCOA?si=ZvlcdqqQLP4Qoqr8',
        videoId: 'XF_dbbzXCOA',
        description: 'Comprehensive lecture on the foundation of the Sultanate under Qutb-ud-din Aibak & Iltutmish, Balban divine right theory, Alauddin Khilji market reforms & military conquests, Muhammad bin Tughlaq experiments, and Sultanate administrative institutions.',
        keywords: [
          'Age of Delhi Sultanate (1206–1526 AD)',
          'Sources of Delhi Sultanate',
          'Arab conquest of Sindh',
          'Turkish invasions of Ghazni and Ghori',
          'Delhi Sultanate dynasties',
          'Slave dynasty: Iltutmish and Balban',
          'Alauddin Khilji',
          'Market reforms and price control',
          'Muhammad bin Tughlaq',
          'Sultanate administration and Iqta system',
          'Sultanate economy and society',
          'Indo-Islamic art and architecture'
        ]
      }
    ]
  },
  {
    id: 'age-of-mughals',
    number: '8',
    name: 'Age of Mughals',
    chapterTitle: '8. Age of Mughals',
    period: 'Mughal Empire & Marathas',
    description: 'Foundation under Babur, Humayun and Sher Shah Suri reforms, imperial consolidation under Akbar (Mansabdari, Sulh-i-Kul), Jahangir, Shah Jahan, Aurangzeb Deccan policy, agrarian relations, architecture, and rise of the Marathas.',
    color: 'from-red-600 to-rose-700',
    badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    videos: [
      {
        id: '8-0',
        code: '8.0',
        title: 'Age of Mughals',
        chapterTitle: '8. Age of Mughals',
        topicName: 'Age of Mughals',
        url: 'https://youtu.be/oPNOFbI8zzM?si=_1oLbqjXuia6AZrI',
        videoId: 'oPNOFbI8zzM',
        description: 'Complete masterclass on the Mughal Empire: First Battle of Panipat, Akbar administrative synthesis, Mansabdari & Jagirdari systems, Mughal court culture, architecture (Taj Mahal, Red Fort), Aurangzeb reign, and Chhatrapati Shivaji Maratha Swarajya.',
        keywords: [
          'Age of Mughals',
          'Babur and First Battle of Panipat',
          'Humayun and Sher Shah Suri administration',
          'Akbar the Great',
          'Mansabdari system',
          'Din-i-Ilahi and Sulh-i-Kul',
          'Jahangir and Shah Jahan',
          'Golden Age of Mughal architecture',
          'Aurangzeb and Deccan policy',
          'Mughal economy and agrarian relations',
          'Mughal art, painting and literature',
          'Rise of Marathas and Chhatrapati Shivaji'
        ]
      }
    ]
  },
  {
    id: 'bhakti-and-sufi-traditions',
    number: '9',
    name: 'Bhakti and Sufi Traditions (8th–16th Century AD)',
    chapterTitle: '9. Bhakti and Sufi Traditions (8th–16th Century AD)',
    period: 'Spiritual Renaissance',
    description: 'Origin and growth of Bhakti movement, Tamil Alvars and Nayanars, devotional saints (Kabir, Guru Nanak, Mirabai, Chaitanya), Sufi silsilas (Chishti, Suhrawardi), mystical philosophy, religious syncretism, and social transformation.',
    color: 'from-purple-600 to-pink-700',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    videos: [
      {
        id: '9-0',
        code: '9.0',
        title: 'Bhakti and Sufi Traditions (8th–16th Century AD)',
        chapterTitle: '9. Bhakti and Sufi Traditions (8th–16th Century AD)',
        topicName: 'Bhakti and Sufi Traditions (8th–16th Century AD)',
        url: 'https://youtu.be/4MwGetYhCxQ?si=NzDycw_LUBmM3HBS',
        videoId: '4MwGetYhCxQ',
        description: 'Detailed analysis of medieval devotional movements: Alvar and Nayanar hymns, Nirguna vs Saguna Bhakti, teachings of Sant Kabir, Guru Nanak, and Mirabai, Sufi Khanqahs, Khwaja Moinuddin Chishti, and their lasting socio-cultural impact.',
        keywords: [
          'Bhakti and Sufi Traditions (8th–16th Century AD)',
          'Bhakti movement in South and North India',
          'Alvars and Nayanars',
          'Devotional saints',
          'Sant Kabir and Bijak',
          'Guru Nanak Dev',
          'Mirabai and Chaitanya Mahaprabhu',
          'Sufi orders and Silsilas',
          'Chishti and Suhrawardi orders',
          'Sufi saints: Moinuddin Chishti and Nizamuddin Auliya',
          'Religious harmony and syncretism',
          'Vernacular literature and social impact'
        ]
      }
    ]
  },
  {
    id: 'deccan-south-india-10th-to-19th-century',
    number: '10',
    name: 'Deccan and South India from 10th Century to 19th Century AD',
    chapterTitle: '10. Deccan and South India (10th to 19th Century AD)',
    period: 'Medieval & Regional Deccan',
    description: 'Kakatiyas of Warangal (Rudrama Devi, Prataparudra), Vijayanagara Empire under Krishnadevaraya, Bahmani Sultanate, Qutb Shahi rulers of Golconda, Asaf Jahi dynasty of Hyderabad, regional administration, culture, and architecture.',
    color: 'from-amber-600 to-yellow-700',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '10-0',
        code: '10.0',
        title: 'Deccan and South India from 10th Century to 19th Century AD',
        chapterTitle: '10. Deccan and South India (10th to 19th Century AD)',
        topicName: 'Deccan and South India (10th to 19th Century AD)',
        url: 'https://youtu.be/NgSBzAjZA6E?si=F04hrpOaA1WbFia5',
        videoId: 'NgSBzAjZA6E',
        description: 'Focused regional history covering Kakatiya heritage (Ramappa Temple, Thousand Pillar Temple), Vijayanagara imperial golden era under Sri Krishnadevaraya, Bahmani disintegration, Golconda Qutb Shahis (Charminar), and Asaf Jahi Hyderabad state.',
        keywords: [
          'Deccan and South India from 10th Century to 19th Century AD',
          'Kakatiyas of Warangal',
          'Rudrama Devi and Prataparudra',
          'Ramappa Temple and Warangal Fort',
          'Vijayanagara Empire',
          'Sri Krishnadevaraya golden reign',
          'Bahmani Sultanate and Deccan Sultanates',
          'Qutb Shahi rulers of Golconda',
          'Charminar and Golconda Fort architecture',
          'Asaf Jahi dynasty of Hyderabad',
          'Regional administration and culture',
          'Deccan architectural synthesis'
        ]
      }
    ]
  },
  {
    id: 'india-under-colonial-rule',
    number: '11',
    name: 'India under Colonial Rule',
    chapterTitle: '11. India under Colonial Rule',
    period: 'British Raj & Resistance',
    description: 'Arrival of European trading companies, British East India Company territorial conquests, Governor-Generals and annexation policies, colonial economic drain, land revenue settlements, and the Great Revolt of 1857.',
    color: 'from-slate-700 to-zinc-900',
    badgeColor: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    videos: [
      {
        id: '11-0',
        code: '11.0',
        title: 'India under Colonial Rule',
        chapterTitle: '11. India under Colonial Rule',
        topicName: 'India under Colonial Rule',
        url: 'https://youtu.be/F2DD4qZuuCU?si=RtPuxDQMNnvFGFhh',
        videoId: 'F2DD4qZuuCU',
        description: 'Comprehensive analysis of European commercial competition, Battles of Plassey (1757) and Buxar (1764), Subsidiary Alliance, Doctrine of Lapse, Drain of Wealth theory, Permanent Settlement, and causes, leaders & consequences of the 1857 Revolt.',
        keywords: [
          'India under Colonial Rule',
          'Arrival of European trading companies',
          'European rivalry in India',
          'East India Company expansion',
          'Battle of Plassey and Battle of Buxar',
          'Governor-Generals and colonial policies',
          'Subsidiary Alliance and Lord Wellesley',
          'Doctrine of Lapse and Lord Dalhousie',
          'Colonial economic impact and Drain of Wealth',
          'Permanent Settlement and Ryotwari system',
          'Revolt of 1857 causes and consequences',
          'Queen Victoria Proclamation of 1858'
        ]
      }
    ]
  },
  {
    id: 'indian-national-movement',
    number: '12',
    name: 'Indian National Movement',
    chapterTitle: '12. Indian National Movement',
    period: 'Freedom Struggle & Republic',
    description: 'Rise of Indian nationalism, foundation of the Indian National Congress, Swadeshi and Vande Mataram movements, revolutionary nationalists, Home Rule League, Gandhian mass movements, role of women, independence, and framing of the Constitution.',
    color: 'from-orange-600 via-rose-600 to-amber-600',
    badgeColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    videos: [
      {
        id: '12-0',
        code: '12.0',
        title: 'Indian National Movement',
        chapterTitle: '12. Indian National Movement',
        topicName: 'Indian National Movement',
        url: 'https://youtu.be/FNx_LPPJthQ?si=eknAEXMREWQRRVGh',
        videoId: 'FNx_LPPJthQ',
        description: 'Masterclass covering the full arc of India’s freedom movement: Moderate & Extremist phases of INC, 1905 Bengal Partition, Swadeshi movement, Bhagat Singh & revolutionaries, Mahatma Gandhi’s Non-Cooperation, Civil Disobedience (Dandi March), Quit India Movement, and Constitution drafting.',
        keywords: [
          'Indian National Movement',
          'Rise of Indian Nationalism',
          'Indian National Congress (1885)',
          'Moderates vs Extremists',
          'Partition of Bengal 1905',
          'Swadeshi and Vande Mataram movements',
          'Revolutionaries: Bhagat Singh, Azad, Bose',
          'Home Rule League and Tilak',
          'Gandhian movements',
          'Non-Cooperation Movement 1920',
          'Civil Disobedience Movement and Dandi March',
          'Quit India Movement 1942',
          'Role of women in national movement',
          'Indian Independence 1947',
          'Framing of the Indian Constitution'
        ]
      }
    ]
  }
];

// Helper: Normalize strings for fuzzy keyword search
const normalize = (str) =>
  str ? str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim() : '';

// Board curriculum specialization tracks for comprehensive academic preparation
const ACADEMIC_TRACKS = [
  {
    id: 'track-ancient',
    title: '1st Year Ancient History & Civilizations',
    board: 'AP & TS Intermediate',
    period: 'Pre-History to 7th Century AD',
    description: 'Scope of history, Indus Valley town planning, Vedic culture, early empires, and the Gupta Golden Age.',
    topics: ['Indus Valley Town Planning & Drainage', 'Early & Later Vedic Societies', 'Rise of Jainism & Buddhism', 'Mauryan Imperial Administration']
  },
  {
    id: 'track-medieval',
    title: 'Classical Medieval Dynasties & Sultanate',
    board: 'AP & TS Intermediate',
    period: '8th to 17th Century AD',
    description: 'Delhi Sultanate market reforms, Mughal administrative system, Bhakti and Sufi traditions.',
    topics: ['Delhi Sultanate Administrative Dynasties', 'Alauddin Khilji Market Reforms', 'Akbar Mansabdari & Sulh-i-Kul', 'Bhakti & Sufi Saint Traditions']
  },
  {
    id: 'track-modern',
    title: 'Modern India & National Freedom Movement',
    board: 'AP & TS Intermediate',
    period: '1757 to 1950 AD',
    description: 'Colonial rule, 1857 Revolt, Gandhian mass movements, and the framing of the Indian Constitution.',
    topics: ['Causes & Impact of 1857 Revolt', 'Economic Drain of Wealth Theory', 'Gandhian Mass Movements (1920-1942)', 'Indian Independence & Constitution']
  },
  {
    id: 'track-regional',
    title: 'Andhra Pradesh & Telangana Heritage',
    board: 'Regional Specialization',
    period: 'Regional Dynasties',
    description: 'Satavahanas, Kakatiyas, Vijayanagara under Krishnadevaraya, Qutb Shahis, and Hyderabad State.',
    topics: ['Satavahana Trade & Amaravati Art', 'Kakatiya Dynasty: Ramappa Heritage', 'Vijayanagara Empire under Krishnadevaraya', 'Asaf Jahi Dynasty (Hyderabad State)']
  }
];

export default function HistoryCurriculum({ onEnroll, currentUser }) {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAcademicTracks, setShowAcademicTracks] = useState(false);
  const [dbVideos, setDbVideos] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Fetch published videos for History from backend API
  const loadDbVideos = useCallback(() => {
    setIsLoadingDb(true);
    fetchStudentVideos({ subject: 'History' })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbVideos(data);
        }
      })
      .catch((err) => console.warn('Could not load database history videos:', err))
      .finally(() => {
        setIsLoadingDb(false);
      });
  }, []);

  useEffect(() => {
    loadDbVideos();
  }, [loadDbVideos]);

  // Listen to video updates from Admin panel
  useEffect(() => {
    const handleUpdate = () => {
      loadDbVideos();
    };
    window.addEventListener('mymarks_video_updated', handleUpdate);
    return () => window.removeEventListener('mymarks_video_updated', handleUpdate);
  }, [loadDbVideos]);

  // Merge static RAW_TOPICS_DATA with dynamic DB videos
  const topicsData = useMemo(() => {
    const chapters = JSON.parse(JSON.stringify(RAW_TOPICS_DATA));

    if (!dbVideos || dbVideos.length === 0) {
      return chapters;
    }

    const activeDbVideos = dbVideos.filter((v) => v.status !== 'archived' && !v.isArchived);

    activeDbVideos.forEach((v, idx) => {
      const vYtId = extractYouTubeId(v.url) || v.videoId || v.youtubeId;
      const chNum = v.chapterNumber ? Number(v.chapterNumber) : null;
      const rawChName = (v.chapterName || v.chapter || '').trim().toLowerCase();

      // Find target chapter
      let matchedChapter = null;
      if (chNum) {
        matchedChapter = chapters.find((c) => Number(c.number) === chNum);
      }
      if (!matchedChapter && rawChName) {
        matchedChapter = chapters.find((c) =>
          c.name.toLowerCase().includes(rawChName) || rawChName.includes(c.name.toLowerCase())
        );
      }

      if (matchedChapter) {
        const parsedKeywords = Array.isArray(v.keywords)
          ? v.keywords
          : typeof v.keywords === 'string'
          ? v.keywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [];

        const cleanTitle = (v.title || v.topicName || matchedChapter.name).trim();

        // Check if an existing video with same URL or videoId exists
        const existingVid = matchedChapter.videos.find((vid) =>
          (vid.url && vid.url === v.url) ||
          (vid.videoId && vid.videoId === vYtId) ||
          (vid.title && vid.title.toLowerCase() === cleanTitle.toLowerCase())
        );

        if (existingVid) {
          existingVid.url = v.url || existingVid.url;
          existingVid.videoId = vYtId || existingVid.videoId;
          existingVid.title = cleanTitle || existingVid.title;
          if (v.description) existingVid.description = v.description;
          if (parsedKeywords.length) existingVid.keywords = parsedKeywords;
          existingVid.isDbUploaded = true;
        } else {
          matchedChapter.videos.push({
            id: v._id ? `db-${v._id}` : `his-db-${matchedChapter.number}-${idx}`,
            code: `${matchedChapter.number}.${matchedChapter.videos.length}`,
            title: cleanTitle,
            chapterTitle: matchedChapter.chapterTitle,
            topicName: matchedChapter.name,
            description: v.description || `Lecture on ${cleanTitle}`,
            url: v.url,
            videoId: vYtId,
            keywords: parsedKeywords.length ? parsedKeywords : matchedChapter.videos[0]?.keywords || [],
            isDbUploaded: true
          });
        }
      }
    });

    return chapters;
  }, [dbVideos]);

  // Flatten all merged videos for searching and filtering
  const allVideos = useMemo(() => {
    return topicsData.flatMap((topic) =>
      topic.videos.map((video) => ({
        ...video,
        topicId: topic.id,
        topicName: topic.name,
        chapterTitle: topic.chapterTitle,
        topicNumber: topic.number,
        topicColor: topic.color,
        badgeColor: topic.badgeColor,
        period: topic.period
      }))
    );
  }, [topicsData]);

  // Search and filter logic
  const { filteredVideos, isSearching } = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const isSearching = trimmedQuery.length > 0;

    let list = allVideos;

    if (!isSearching && selectedTopicId !== 'all') {
      list = list.filter((v) => v.topicId === selectedTopicId);
      return { filteredVideos: list, isSearching };
    }

    if (isSearching) {
      const rawLower = trimmedQuery.toLowerCase();
      const normQ = normalize(trimmedQuery);
      const queryTokens = normQ.split(' ').filter(Boolean);

      const matches = allVideos
        .map((video) => {
          const titleNorm = normalize(video.title);
          const topicNorm = normalize(video.topicName);
          const descNorm = normalize(video.description);
          const codeNorm = normalize(video.code);
          const numNorm = normalize(video.topicNumber);
          const periodNorm = normalize(video.period);
          const keywords = Array.isArray(video.keywords) ? video.keywords : [];
          const keywordsNorm = keywords.map(normalize);

          const directTitleMatch =
            video.title.toLowerCase().includes(rawLower) || titleNorm.includes(normQ);
          const directCodeMatch =
            (video.code && video.code.toLowerCase().includes(rawLower)) ||
            (video.topicNumber && video.topicNumber.toString() === rawLower) ||
            codeNorm === normQ ||
            numNorm === normQ;
          const directTopicMatch =
            video.topicName.toLowerCase().includes(rawLower) || topicNorm.includes(normQ);
          const directPeriodMatch =
            video.period && (video.period.toLowerCase().includes(rawLower) || periodNorm.includes(normQ));

          const matchedKeywords = keywords.filter((kw) => {
            const kwNorm = normalize(kw);
            return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
          });

          const allTokensMatch =
            queryTokens.length > 0 &&
            queryTokens.every((token) => {
              return (
                titleNorm.includes(token) ||
                topicNorm.includes(token) ||
                descNorm.includes(token) ||
                periodNorm.includes(token) ||
                keywordsNorm.some((kw) => kw.includes(token))
              );
            });

          const isMatch =
            directTitleMatch ||
            directCodeMatch ||
            directTopicMatch ||
            directPeriodMatch ||
            matchedKeywords.length > 0 ||
            allTokensMatch;

          if (isMatch) {
            return {
              ...video,
              matchedKeyword: matchedKeywords[0] || (directTitleMatch ? null : keywords[0])
            };
          }
          return null;
        })
        .filter(Boolean);

      if (selectedTopicId !== 'all') {
        const tabFiltered = matches.filter((v) => v.topicId === selectedTopicId);
        if (tabFiltered.length > 0) {
          return { filteredVideos: tabFiltered, isSearching };
        }
      }

      return { filteredVideos: matches, isSearching };
    }

    return { filteredVideos: list, isSearching };
  }, [allVideos, selectedTopicId, searchQuery]);

  // Index navigation for the video player modal
  const currentVideoIndex = useMemo(() => {
    if (!activeVideo) return -1;
    return filteredVideos.findIndex((v) => v.id === activeVideo.id);
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
    <section 
      id="history-curriculum" 
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-4 border border-amber-200/60 dark:border-amber-800/60 shadow-xs">
            <Landmark size={15} className="text-amber-600 dark:text-amber-400" />
            <span>AP & TS INTERMEDIATE 1st & 2nd YEAR – HISTORY</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            History Chapter-Wise Video Lectures
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium leading-relaxed">
            Master all 12 chapters with topic-by-topic video lectures, historical source analysis, archaeological evidence, dynastic timelines, and board exam answer-writing strategies.
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures Available
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  These are curated sample demo lectures. <strong>Enroll now</strong> to unlock comprehensive chapter notes, map pointing masterclasses, 10-mark & 5-mark question banks, and live 1-on-1 faculty doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('History Full Course - Complete 12 Chapters Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Filter Controls: Topic Selector Tabs & Smart Keyword Search Bar */}
        <div className="mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Chapter Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedTopicId('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedTopicId === 'all' && !isSearching
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Chapters ({allVideos.length})
            </button>
            {topicsData.map((topic) => {
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
                  {topic.chapterTitle}
                </button>
              );
            })}
          </div>

          {/* Smart Keyword Search Bar */}
          <div className="relative w-full lg:w-96 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword (e.g. Harappan, Akbar, Sangam, 1857, Dandi...)"
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching video lectures found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Try searching with general keywords like <strong>Harappan</strong>, <strong>Magadha</strong>, <strong>Delhi Sultanate</strong>, <strong>Akbar</strong>, <strong>Kakatiya</strong>, or <strong>1857 Revolt</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Search & View All ({allVideos.length})
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
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Chapter Code Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white font-mono text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Scroll size={12} className="text-amber-400" />
                      <span>Chapter {video.code}</span>
                    </div>

                    {/* Center Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-115 transition-transform duration-300 ring-4 ring-white/30">
                        <Play size={20} className="ml-0.5 fill-white" />
                      </div>
                    </div>

                    {/* YouTube Brand Indicator */}
                    <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                      <span>YouTube Lecture</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Period & Category Tag */}
                      <div className="text-[11px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                        <Landmark size={11} className="shrink-0" />
                        <span className="truncate">{video.period || video.topicName}</span>
                      </div>

                      {/* Video Title */}
                      <h3 
                        onClick={() => setActiveVideo(video)}
                        className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug mb-2"
                        title={video.title}
                      >
                        <span className="text-amber-600 dark:text-amber-400 font-extrabold mr-1.5">{video.code}:</span>
                        {video.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {video.description}
                      </p>

                      {/* Keywords Preview Chips */}
                      {video.keywords && video.keywords.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {video.keywords.slice(0, 3).map((kw, kwIdx) => (
                            <span 
                              key={kwIdx}
                              className="px-2 py-0.5 text-[10px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[170px]"
                            >
                              {kw}
                            </span>
                          ))}
                          {video.keywords.length > 3 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center font-bold">
                              +{video.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Matching Keyword Indicator */}
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
                        <Play size={14} className="fill-white" />
                        <span>Watch Demo</span>
                      </button>

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                        title={`Open ${video.title} on YouTube`}
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

        {/* Collapsible Academic Tracks Section */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scroll size={20} className="text-amber-600 dark:text-amber-400" />
                <span>Intermediate History Board Tracks & Specializations</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Structured curriculum paths tailored for AP / TS Intermediate Board Examinations and Civil Services foundations.
              </p>
            </div>
            <button
              onClick={() => setShowAcademicTracks(!showAcademicTracks)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{showAcademicTracks ? 'Hide Tracks' : 'View 4 Board Tracks'}</span>
              <ChevronRight size={14} className={`transition-transform duration-200 ${showAcademicTracks ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showAcademicTracks && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
              {ACADEMIC_TRACKS.map((track) => (
                <div 
                  key={track.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400 mb-1">
                      {track.board}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                      {track.description}
                    </p>
                    <div className="space-y-1 mb-4">
                      {track.topics.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={12} className="text-amber-500 shrink-0" />
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onEnroll && onEnroll(`Track: ${track.title}`)}
                    className="w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer border border-amber-200/60 dark:border-amber-800/60"
                  >
                    Enroll in Track
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Doubt Clearing & Live Tuition CTA Banner */}
        <div className="mt-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white shadow-xl relative overflow-hidden border border-amber-600/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-amber-400/20">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Live 1-on-1 Faculty Mentorship</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Help with History Essays, Timelines & Map Pointing?
              </h3>
              <p className="text-amber-100/80 text-sm sm:text-base leading-relaxed">
                Connect directly with senior Intermediate History faculty for personalized 1-on-1 essay framing, 10-mark structured answers, chronological flowchart mnemonics, and guaranteed 100/100 board score preparation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('History 1-on-1 Live Doubt & Board Coaching')}
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
      {activeVideo && activeVideo.videoId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 shrink-0">
                  Chapter {activeVideo.code}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeVideo.title}
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
            <div className="relative aspect-video w-full bg-black shrink-0">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Modal Body & Topic Notes */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-48 space-y-3 bg-slate-900 border-t border-slate-800">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <BookOpen size={13} />
                  <span>Topic Overview & Key Exam Concepts</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>

              {activeVideo.keywords && activeVideo.keywords.length > 0 && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">
                    High-Yield Chapter Keywords:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVideo.keywords.map((kw, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700"
                      >
                        {kw}
                      </span>
                    ))}
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
                  if (onEnroll) onEnroll(`History Doubt Session: Chapter ${current.code} - ${current.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <span>Ask Doubt in this Chapter</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
