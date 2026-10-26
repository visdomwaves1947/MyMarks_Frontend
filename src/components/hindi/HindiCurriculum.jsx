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
  Feather,
  Clock
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'poetry',
    number: '1',
    name: 'पद्यभाग (Poetry)',
    englishName: 'Poetry',
    description: 'कबीरदास एवं संत रैदास के नीतिपरक दोहे, महादेवी वर्मा का मुरझाया फूल, रामनरेश त्रिपाठी का देशप्रेम, और सियारामशरण गुप्त की समय कविता का संपूर्ण भावार्थ एवं प्रश्न-उत्तर।',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'कबीरदास के दोहे',
        topicName: 'पद्यभाग (Poetry)',
        author: 'कबीरदास',
        url: 'https://youtu.be/v7DW8aX9C_0?si=pPymWbJKOxSZXhNV',
        videoId: 'v7DW8aX9C_0',
        keywords: [
          'कबीरदास के दोहे',
          'कबीरदास के दोहे अर्थ',
          'व्याख्या',
          'भावार्थ',
          'प्रश्न-उत्तर',
          'कबीरदास',
          'नीति के दोहे'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'संत रैदास के दोहे',
        topicName: 'पद्यभाग (Poetry)',
        author: 'संत रैदास',
        url: 'https://youtu.be/s3XE6nXUCEI?si=EQJjI-c4c1-x0rjJ',
        videoId: 's3XE6nXUCEI',
        keywords: [
          'संत रैदास के दोहे',
          'संत रैदास के दोहे अर्थ',
          'व्याख्या',
          'भावार्थ',
          'प्रश्न-उत्तर',
          'रैदास',
          'भक्ति पद'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'मुरझाया फूल',
        topicName: 'पद्यभाग (Poetry)',
        author: 'महादेवी वर्मा',
        url: 'https://youtu.be/BkrIwR6Gj-s?si=7c9oQHQiJrM3zMiX',
        videoId: 'BkrIwR6Gj-s',
        keywords: [
          'मुरझाया फूल',
          'महादेवी वर्मा',
          'कविता सारांश',
          'व्याख्या',
          'भावार्थ',
          'प्रश्न-उत्तर',
          'छायावाद'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'वह देश कौन सा है?',
        topicName: 'पद्यभाग (Poetry)',
        author: 'रामनरेश त्रिपाठी',
        url: 'https://youtu.be/7ljLaD2pDcY?si=8u0xqdjV1OYlcSjZ',
        videoId: '7ljLaD2pDcY',
        keywords: [
          'वह देश कौन सा है?',
          'रामनरेश त्रिपाठी',
          'कविता सारांश',
          'भावार्थ',
          'प्रश्न-उत्तर',
          'देशभक्ति कविता'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'समय',
        topicName: 'पद्यभाग (Poetry)',
        author: 'सियारामशरण गुप्त',
        url: 'https://youtu.be/mzXlcacMSSs?si=wPzAPOT8ACVQeiZH',
        videoId: 'mzXlcacMSSs',
        keywords: [
          'समय',
          'समय कविता',
          'सियारामशरण गुप्त',
          'सारांश',
          'भावार्थ',
          'प्रश्न-उत्तर',
          'समय का सदुपयोग'
        ]
      }
    ]
  },
  {
    id: 'prose',
    number: '2',
    name: 'गद्यभाग (Prose)',
    englishName: 'Prose',
    description: 'मुंशी प्रेमचंद की परीक्षा, सुदर्शन की हार की जीत, आचार्य रामचंद्र शुक्ल का मित्रता निबंध, रवींद्रनाथ ठाकुर का काबुलीवाला, और देवेंद्र सत्यार्थी का इतिहास बदलता है।',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'परीक्षा',
        topicName: 'गद्यभाग (Prose)',
        author: 'मुंशी प्रेमचंद',
        url: null,
        videoId: null,
        isComingSoon: true,
        keywords: [
          'परीक्षा',
          'मुंशी प्रेमचंद',
          'कहानी सारांश',
          'दीवान सुजान सिंह',
          'पात्र चित्रण',
          'प्रश्न-उत्तर'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'हार की जीत',
        topicName: 'गद्यभाग (Prose)',
        author: 'सुदर्शन',
        url: 'https://youtu.be/QB8vd8gAsm8?si=IBOK90kLzQPZgFcu',
        videoId: 'QB8vd8gAsm8',
        keywords: [
          'हार की जीत',
          'सुदर्शन',
          'कहानी सारांश',
          'बाबा भारती',
          'सुल्तान घोड़ा',
          'डाकू खड्गसिंह',
          'संदेश',
          'प्रश्न-उत्तर'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'मित्रता',
        topicName: 'गद्यभाग (Prose)',
        author: 'आचार्य रामचंद्र शुक्ल',
        url: 'https://youtu.be/H4ni3PWjAUc?si=_0ef_1g7Zv7NfRLe',
        videoId: 'H4ni3PWjAUc',
        keywords: [
          'मित्रता',
          'आचार्य रामचंद्र शुक्ल',
          'निबंध सारांश',
          'सच्चा मित्र',
          'कुसंग का ज्वर',
          'मुख्य विचार',
          'प्रश्न-उत्तर'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'काबुलीवाला',
        topicName: 'गद्यभाग (Prose)',
        author: 'रवींद्रनाथ ठाकुर',
        url: 'https://youtu.be/kNG7G7Ky1vw?si=-6gTATK6DrLLBYT5',
        videoId: 'kNG7G7Ky1vw',
        keywords: [
          'काबुलीवाला',
          'रवींद्रनाथ ठाकुर',
          'कहानी सारांश',
          'मिनी',
          'रहमत काबुलीवाला',
          'पात्र',
          'प्रश्न-उत्तर'
        ]
      },
      {
        id: '2-5',
        code: '2.5',
        title: 'इतिहास बदलता है',
        topicName: 'गद्यभाग (Prose)',
        author: 'देवेंद्र सत्यार्थी',
        url: 'https://youtu.be/iUMmpUblcI8?si=W44CfF3CmraGOdlS',
        videoId: 'iUMmpUblcI8',
        keywords: [
          'इतिहास बदलता है',
          'देवेंद्र सत्यार्थी',
          'निबंध सारांश',
          'इतिहास दर्शन',
          'प्रश्न-उत्तर'
        ]
      }
    ]
  },
  {
    id: 'one-act',
    number: '3',
    name: 'एकांकी (One-Act Plays)',
    englishName: 'One-Act Plays',
    description: 'विनोद रस्तोगी कृत दहेज समस्या पर चोट करती बहू की विदा, सेठ गोविंद दास का सच्चा धर्म, और गोविंद वल्लभ पंत की विष कन्या एकांकी का गहन अध्ययन।',
    color: 'from-indigo-600 to-purple-600',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'बहू की विदा',
        topicName: 'एकांकी (One-Act Plays)',
        author: 'विनोद रस्तोगी',
        url: 'https://youtu.be/msMvO5jL0Bw?si=DZ9qDgSKjttA3hDR',
        videoId: 'msMvO5jL0Bw',
        keywords: [
          'बहू की विदा',
          'विनोद रस्तोगी',
          'एकांकी सारांश',
          'जीवनलाल',
          'कमला',
          'दहेज प्रथा',
          'पात्र',
          'प्रश्न-उत्तर'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'सच्चा धर्म',
        topicName: 'एकांकी (One-Act Plays)',
        author: 'सेठ गोविंद दास',
        url: 'https://youtu.be/rQSh-Wh-Q_s?si=5_xzjAMoLs-VkUwp',
        videoId: 'rQSh-Wh-Q_s',
        keywords: [
          'सच्चा धर्म',
          'सेठ गोविंद दास',
          'एकांकी सारांश',
          'मानवता',
          'प्रश्न-उत्तर',
          'पात्र'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'विष कन्या',
        topicName: 'एकांकी (One-Act Plays)',
        author: 'गोविंद वल्लभ पंत',
        url: 'https://youtu.be/WmsFBWLotgo?si=KYLbjKn9g9UsOOud',
        videoId: 'WmsFBWLotgo',
        keywords: [
          'विष कन्या',
          'गोविंद वल्लभ पंत',
          'एकांकी सारांश',
          'ऐतिहासिक पृष्ठभूमि',
          'पात्र',
          'प्रश्न-उत्तर'
        ]
      }
    ]
  },
  {
    id: 'grammar',
    number: '4',
    name: 'व्याकरण (Grammar)',
    englishName: 'Grammar',
    description: 'शब्द विचार, संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रिया विशेषण, लिंग, वचन, पर्यायवाची, विलोम, शुद्ध वर्तनी, काल, अंक/संख्या, कारक, वर्तनी दोष, और उपसर्ग-प्रत्यय का संपूर्ण विश्लेषण।',
    color: 'from-blue-600 to-cyan-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'शब्द विचार',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/iqiQW7KOhyM?si=gM3-S4Cs3R_WuWwU',
        videoId: 'iqiQW7KOhyM',
        keywords: [
          'शब्द विचार',
          'संज्ञा',
          'सर्वनाम',
          'विशेषण',
          'क्रिया',
          'भेद',
          'व्याकरण'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'संज्ञा',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/K81UNo5jIHM?si=4n2we_lRfRyKe7P9',
        videoId: 'K81UNo5jIHM',
        keywords: [
          'संज्ञा',
          'संज्ञा के भेद',
          'व्यक्तिवाचक',
          'जातिवाचक',
          'भाववाचक',
          'उदाहरण',
          'व्याकरण'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'सर्वनाम',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/8VooQtXUZzw?si=RMnuQrSkr39HYmpl',
        videoId: '8VooQtXUZzw',
        keywords: [
          'सर्वनाम',
          'सर्वनाम के भेद',
          'पुरुषवाचक',
          'निजवाचक',
          'निश्चयवाचक',
          'अनिश्चयवाचक',
          'संबंधवाचक',
          'प्रश्नवाचक',
          'व्याकरण'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'विशेषण',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/hOC-IbHg2W8?si=yMkrq5KEY5R54yBF',
        videoId: 'hOC-IbHg2W8',
        keywords: [
          'विशेषण',
          'विशेषण के भेद',
          'गुणवाचक',
          'संख्यावाचक',
          'परिमाणवाचक',
          'सार्वनामिक',
          'उदाहरण',
          'व्याकरण'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'क्रिया',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/0ROoynlsLdY?si=pNzdD9S371AYaOZB',
        videoId: '0ROoynlsLdY',
        keywords: [
          'क्रिया',
          'सकर्मक क्रिया',
          'अकर्मक क्रिया',
          'क्रिया के भेद',
          'उदाहरण',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'क्रिया विशेषण',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/bwGvMKw0Xmk?si=ypSdPPnceWKAqqYS',
        videoId: 'bwGvMKw0Xmk',
        keywords: [
          'क्रिया विशेषण',
          'रीतिवाचक',
          'स्थानवाचक',
          'कालवाचक',
          'परिमाणवाचक',
          'भेद',
          'व्याकरण'
        ]
      },
      {
        id: '4-7',
        code: '4.7',
        title: 'लिंग',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/WVH6a9h7YT0?si=mAp7fI5_q4c-VIpv',
        videoId: 'WVH6a9h7YT0',
        keywords: [
          'लिंग',
          'पुल्लिंग',
          'स्त्रीलिंग',
          'लिंग पहचान',
          'उदाहरण',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-8',
        code: '4.8',
        title: 'वचन',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://www.youtube.com/live/vRjEEKhuSvA?si=ih8xXa6xDMEVPmE9',
        videoId: 'vRjEEKhuSvA',
        keywords: [
          'वचन',
          'एकवचन',
          'बहुवचन',
          'वचन परिवर्तन',
          'उदाहरण',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-9',
        code: '4.9',
        title: 'पर्यायवाची शब्द',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/PL-1k73O0x4?si=SQfYiGE8J3rm95rs',
        videoId: 'PL-1k73O0x4',
        keywords: [
          'पर्यायवाची शब्द',
          'समानार्थी शब्द',
          'महत्वपूर्ण शब्द',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-10',
        code: '4.10',
        title: 'विलोम शब्द',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/1dj2fVp64CI?si=A9KPbrSqZcrKVHi6',
        videoId: '1dj2fVp64CI',
        keywords: [
          'विलोम शब्द',
          'विपरीतार्थक शब्द',
          'महत्वपूर्ण शब्द',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-11',
        code: '4.11',
        title: 'शुद्ध वर्तनी',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/RYOTIaL7_sc?si=bmy7oIoBI6lqrgsM',
        videoId: 'RYOTIaL7_sc',
        keywords: [
          'शुद्ध वर्तनी',
          'अशुद्ध शब्द',
          'वर्तनी सुधार',
          'शुद्ध-अशुद्ध',
          'अभ्यास',
          'व्याकरण'
        ]
      },
      {
        id: '4-12',
        code: '4.12',
        title: 'काल',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/Mfmtx9u10go?si=J_AxulXDoeE-eslO',
        videoId: 'Mfmtx9u10go',
        keywords: [
          'काल',
          'वर्तमान काल',
          'भूतकाल',
          'भविष्यत काल',
          'काल के भेद',
          'काल परिवर्तन',
          'व्याकरण'
        ]
      },
      {
        id: '4-13',
        code: '4.13',
        title: 'अंक / संख्या',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/Dyjk1fD7ai4?si=Q2gXNwL-CCR2CChq',
        videoId: 'Dyjk1fD7ai4',
        keywords: [
          'अंक / संख्या',
          'अंक',
          'संख्या',
          'हिंदी गिनती',
          'संख्या शब्द रूप',
          'व्याकरण'
        ]
      },
      {
        id: '4-14',
        code: '4.14',
        title: 'कारक',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/FmHGs1Ht-h8?si=DwDiQVkRjT524gB_',
        videoId: 'FmHGs1Ht-h8',
        keywords: [
          'कारक',
          'कारक के भेद',
          'कारक चिह्न',
          'विभक्ति',
          'कर्ता',
          'कर्म',
          'करण',
          'उदाहरण',
          'व्याकरण'
        ]
      },
      {
        id: '4-15',
        code: '4.15',
        title: 'वर्तनी दोष',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/11LBClP4Htg?si=0TWSItsAAwL85PSW',
        videoId: '11LBClP4Htg',
        keywords: [
          'वर्तनी दोष',
          'अशुद्धि शोधन',
          'शुद्ध शब्द',
          'सामान्य वर्तनी दोष',
          'अभ्यास'
        ]
      },
      {
        id: '4-16',
        code: '4.16',
        title: 'उपसर्ग और प्रत्यय',
        topicName: 'व्याकरण (Grammar)',
        url: 'https://youtu.be/jyeZt_8yy9c?si=8JvPdQ7zeCAMcHtR',
        videoId: 'jyeZt_8yy9c',
        keywords: [
          'उपसर्ग और प्रत्यय',
          'उपसर्ग',
          'प्रत्यय',
          'उदाहरण',
          'भेद',
          'शब्द निर्माण',
          'व्याकरण'
        ]
      }
    ]
  },
  {
    id: 'writing',
    number: '5',
    name: 'लेखन एवं भाषा कौशल (Writing & Composition)',
    englishName: 'Writing & Composition',
    description: 'अंग्रेजी से हिंदी अनुवाद के अचूक नियम और अभ्यास, तथा औपचारिक व अनौपचारिक पत्र लेखन का संपूर्ण प्रारूप।',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '5-1',
        code: '5.1',
        title: 'अनुवाद',
        topicName: 'लेखन एवं भाषा कौशल (Writing & Composition)',
        url: 'https://youtu.be/CkeuKtYLUrk?si=OlBNTzvtyOif-EfV',
        videoId: 'CkeuKtYLUrk',
        keywords: [
          'अनुवाद',
          'हिंदी अनुवाद अभ्यास',
          'अंग्रेजी से हिंदी अनुवाद',
          'अनुवाद के नियम',
          'भाषा कौशल'
        ]
      },
      {
        id: '5-2',
        code: '5.2',
        title: 'पत्र लेखन',
        topicName: 'लेखन एवं भाषा कौशल (Writing & Composition)',
        url: 'https://youtu.be/gPuUv6aT6sY?si=0IRq2lmCV2sd2Mus',
        videoId: 'gPuUv6aT6sY',
        keywords: [
          'पत्र लेखन',
          'पत्र लेखन प्रारूप',
          'औपचारिक पत्र',
          'अनौपचारिक पत्र',
          'कार्यालयी पत्र',
          'प्रार्थना पत्र'
        ]
      }
    ]
  }
];

// Flatten all videos for quick multi-topic search
const ALL_VIDEOS = TOPICS_DATA.flatMap(topic => 
  topic.videos.map(v => ({
    ...v,
    topicId: topic.id,
    topicNumber: topic.number,
    topicName: topic.name,
    topicBadgeColor: topic.badgeColor
  }))
);

export default function HindiCurriculum({ onEnroll }) {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Filter videos based on active topic filter and search query
  const filteredVideos = useMemo(() => {
    let list = ALL_VIDEOS;

    if (selectedTopicId !== 'all') {
      list = list.filter(v => v.topicId === selectedTopicId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v => 
        v.title.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.topicName.toLowerCase().includes(q) ||
        (v.author && v.author.toLowerCase().includes(q)) ||
        v.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedTopicId, searchQuery]);

  const currentVideoIndex = activeVideo
    ? filteredVideos.findIndex(v => v.id === activeVideo.id)
    : -1;

  const handleNextVideo = () => {
    if (currentVideoIndex >= 0 && currentVideoIndex < filteredVideos.length - 1) {
      const nextVid = filteredVideos[currentVideoIndex + 1];
      if (nextVid.videoId) {
        setActiveVideo(nextVid);
      }
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      const prevVid = filteredVideos[currentVideoIndex - 1];
      if (prevVid.videoId) {
        setActiveVideo(prevVid);
      }
    }
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <section id="hindi-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-4 border border-amber-200/60 dark:border-amber-800/60">
            <Tv size={15} />
            <span>AP & TS Intermediate Hindi Video Lectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Hindi Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            पद्यभाग (दोहे व कविताएँ), गद्यभाग (कहानियाँ व निबंध), एकांकी, संपूर्ण व्याकरण तथा पत्र एवं अनुवाद लेखन के अध्याय-वार वीडियो व्याख्यान एवं भावार्थ।
          </p>

          {/* Sample Demo Notice Banner */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-600/70 shadow-md text-amber-950 dark:text-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center sm:items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-200">
                  Sample Demo Video Lectures (हिंदी डेमो व्याख्यान)
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  These are curated sample demo lectures. <strong>Enroll now</strong> to get complete access to 100/100 board blueprint, question banks, grammar workbooks, and 1-on-1 mentor guidance!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Hindi Full Course - All Chapters Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Filter Controls: Topic Tabs & Keyword Search */}
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
              placeholder="Search chapter, poet or keyword (e.g. कबीरदास, संज्ञा, दोहे, पत्र...)"
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
                Found <strong className="font-bold text-amber-700 dark:text-amber-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'lesson' : 'lessons'} for "<em>{searchQuery}</em>"
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching Hindi lessons found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Try searching with general keywords like <strong>कबीरदास</strong>, <strong>संज्ञा</strong>, <strong>मित्रता</strong>, <strong>कारक</strong>, or <strong>पत्र लेखन</strong>.
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
              const hasVideo = Boolean(video.videoId);
              const thumbnailUrl = hasVideo 
                ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                : null;

              return (
                <div
                  key={video.id}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1"
                >
                  {/* Thumbnail Container */}
                  <div 
                    onClick={() => {
                      if (hasVideo) setActiveVideo(video);
                    }}
                    className={`relative aspect-video w-full overflow-hidden bg-slate-900 ${hasVideo ? 'cursor-pointer' : 'cursor-default'}`}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all" />

                        {/* Centered Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300">
                            <Play size={20} className="fill-white ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 text-center">
                        <Clock size={28} className="text-amber-400 mb-2 animate-pulse" />
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Video Lecture Coming Soon</span>
                        <span className="text-[11px] text-slate-400 mt-1">Recording under production</span>
                      </div>
                    )}

                    {/* Code Badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                      {video.code}
                    </div>

                    {/* Author tag if available */}
                    {video.author && (
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-bold">
                        {video.author}
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Topic Badge */}
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
                      className={`text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 transition-colors ${hasVideo ? 'cursor-pointer hover:text-amber-600 dark:hover:text-amber-400' : ''}`}
                    >
                      {video.title}
                    </h3>

                    {/* Keywords Preview */}
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto pt-2">
                      {video.keywords.slice(0, 3).map((kw, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(kw)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer text-left"
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
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shadow-amber-600/20"
                          >
                            <Play size={13} className="fill-white" />
                            <span>Watch Demo</span>
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
                          className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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

        {/* Bottom CTA Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-900/90 via-slate-900 to-indigo-950 border border-amber-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-amber-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
                <Feather size={14} />
                <span>Complete AP / TS Board Hindi Preparation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2">
                Need Full Chapter Notes, Poetry भावार्थ & 1-on-1 Guidance?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Get full access to all 29 chapter video masterclasses, line-by-line dohe explanations, solved grammar workbooks, and board exam answer-writing masterclasses to score a guaranteed 100/100.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Hindi 1-on-1 Live Doubt & Board Coaching')}
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
                  if (onEnroll) onEnroll(`Hindi Help: Topic ${current.code} - ${current.title}`);
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
