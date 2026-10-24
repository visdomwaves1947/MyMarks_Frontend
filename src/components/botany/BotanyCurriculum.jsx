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
  Leaf,
  Sprout
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'diversity-living-world',
    number: '1',
    name: 'Diversity in the Living World',
    description: 'Characteristics of living organisms, taxonomic hierarchy, five kingdom biological classification, plant kingdom diversity (algae, bryophytes, pteridophytes, gymnosperms, angiosperms), and botanical science fundamentals.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'The Living World',
        url: 'https://youtu.be/HWVbdS1_RYw?si=9_l376kpnYSDpGKf',
        videoId: 'HWVbdS1_RYw',
        keywords: [
          'The Living World',
          'The Living World explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Characteristics of Living Organisms',
          'Taxonomic Categories and Hierarchy',
          'Binomial Nomenclature',
          'Taxonomical Aids Herbarium Botanical Gardens',
          'Flora and Fauna'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Biological Classification',
        url: 'https://youtu.be/I7MwX-ijzvE?si=2mrYa0G0oExjashW',
        videoId: 'I7MwX-ijzvE',
        keywords: [
          'Biological Classification',
          'Biological Classification explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Five Kingdom Classification',
          'Kingdom Monera Archaebacteria Eubacteria',
          'Kingdom Protista Chrysophytes Dinoflagellates',
          'Kingdom Fungi Phycomycetes Ascomycetes Basidiomycetes',
          'Viruses Viroids Prions Lichens'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Science of Plants – Botany',
        url: 'https://youtu.be/8-G7D_sy7qE?si=iwBanLMa4vFairP',
        videoId: '8-G7D_sy7qE',
        keywords: [
          'Science of Plants – Botany',
          'Science of Plants – Botany explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Branches of Botany',
          'Scope of Botanical Studies',
          'Origin and Evolution of Plant Life',
          'Development of Botany in India'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Plant Kingdom',
        url: 'https://youtu.be/ntfItC00Rus?si=zyVAWE4oVIy8Q2In',
        videoId: 'ntfItC00Rus',
        keywords: [
          'Plant Kingdom',
          'Plant Kingdom explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Algae Chlorophyceae Phaeophyceae Rhodophyceae',
          'Bryophytes Liverworts and Mosses',
          'Pteridophytes Ferns and Horsetails',
          'Gymnosperms Cycas and Pinus',
          'Angiosperms Monocots and Dicots',
          'Alternation of Generations Haplontic Diplontic'
        ]
      }
    ]
  },
  {
    id: 'structural-organisation-morphology',
    number: '2',
    name: 'Structural Organisation in Plants – Morphology',
    description: 'Root, stem, and leaf modifications, venation, phyllotaxy, inflorescence types (racemose & cymose), flower morphology, parts of flower, floral formula, fruits, and seeds.',
    color: 'from-green-600 to-emerald-600',
    badgeColor: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Morphology of Flowering Plants',
        url: 'https://youtu.be/dwzOc6X5aeE?si=jfUPwqkc66rQnY_i',
        videoId: 'dwzOc6X5aeE',
        keywords: [
          'Morphology of Flowering Plants',
          'Morphology of Flowering Plants explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Root System Tap Root Fibrous Root Modifications',
          'Stem Modifications Underground Aerial Subaerial',
          'Leaf Venation Reticulate and Parallel',
          'Phyllotaxy Alternate Opposite Whorled',
          'Inflorescence Racemose Cymose',
          'Parts of Flower Calyx Corolla Androecium Gynoecium',
          'Aestivation Valvate Twisted Imbricate Vexillary',
          'Placentation Marginal Axile Parietal Free Central',
          'Fruit and Seed Structure Monocot Dicot Seed'
        ]
      }
    ]
  },
  {
    id: 'reproduction-in-plants',
    number: '3',
    name: 'Reproduction in Plants',
    description: 'Asexual reproduction, vegetative propagation methods, sexual reproduction in angiosperms, microsporogenesis, megasporogenesis, pollination mechanisms, double fertilization, and post-fertilization changes.',
    color: 'from-teal-600 to-cyan-600',
    badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Mode of Reproduction',
        url: 'https://youtu.be/D2ISsA78Q2I?si=_Ln_dbUR4sVP0Muv',
        videoId: 'D2ISsA78Q2I',
        keywords: [
          'Mode of Reproduction',
          'Mode of Reproduction explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Asexual Reproduction in Plants',
          'Vegetative Propagation Natural and Artificial',
          'Runners Stolons Suckers Tubers Rhizomes Bulbs',
          'Cutting Grafting Layering Tissue Culture Micropropagation'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Sexual Reproduction in Flowering Plants',
        url: 'https://youtu.be/HP21hIVJhWI?si=uZ42pb0QmQTiUoOT',
        videoId: 'HP21hIVJhWI',
        keywords: [
          'Sexual Reproduction in Flowering Plants',
          'Sexual Reproduction in Flowering Plants explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Microsporogenesis Pollen Grain Structure',
          'Megasporogenesis Embryo Sac 7-celled 8-nucleate',
          'Pollination Autogamy Geitonogamy Xenogamy',
          'Agents of Pollination Wind Water Insects Anemophily Entomophily',
          'Pollen Pistil Interaction',
          'Double Fertilization and Triple Fusion',
          'Endosperm and Embryo Development Dicot Monocot',
          'Apomixis and Polyembryony'
        ]
      }
    ]
  },
  {
    id: 'plant-systematics',
    number: '4',
    name: 'Plant Systematics',
    description: 'Principles of plant taxonomy, Bentham and Hooker classification system, floral diagrams, floral formulae, and comprehensive comparative family studies of Fabaceae, Solanaceae, and Liliaceae.',
    color: 'from-lime-600 to-green-600',
    badgeColor: 'bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Taxonomy of Angiosperms',
        url: 'https://youtu.be/Cu6UqzrIRs4?si=RzBTyYOqJcxlUX2Z',
        videoId: 'Cu6UqzrIRs4',
        keywords: [
          'Taxonomy of Angiosperms',
          'Taxonomy of Angiosperms explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Bentham and Hooker System of Classification',
          'Natural Artificial and Phylogenetic Classification',
          'Floral Formula and Floral Diagram Symbols',
          'Family Fabaceae Papilionaceae Characteristics',
          'Family Solanaceae Potato Family Characteristics',
          'Family Liliaceae Lily Family Characteristics',
          'Economic Importance of Angiospermic Families'
        ]
      }
    ]
  },
  {
    id: 'structure-and-functions',
    number: '5',
    name: 'Structure and Functions',
    description: 'Cell biology ultrastructure, cell theory, prokaryotic and eukaryotic organelles, biomolecules chemistry, enzyme kinetics, and stages of cell division (mitosis and meiosis).',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '5-1',
        code: '5.1',
        title: 'The Unit of Life',
        url: 'https://youtu.be/jaJpT1FnDfE?si=cqFFvRtRDD6J_IHU',
        videoId: 'jaJpT1FnDfE',
        keywords: [
          'The Unit of Life',
          'The Unit of Life explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Cell Theory Schleiden Schwann Virchow',
          'Prokaryotic Cell Structure Bacteria Cell Envelope',
          'Eukaryotic Plant Cell Wall and Fluid Mosaic Model',
          'Endomembrane System ER Golgi Lysosomes Vacuoles',
          'Chloroplast Thylakoids Stroma',
          'Mitochondria Cristae Powerhouse of Cell',
          'Ribosomes 70S and 80S',
          'Nucleus Chromatin Nucleolus Chromosomes'
        ]
      },
      {
        id: '5-2',
        code: '5.2',
        title: 'Biomolecules',
        url: 'https://youtu.be/j5VA6YrqTNs?si=ojt3KdPBtbcxeI5R',
        videoId: 'j5VA6YrqTNs',
        keywords: [
          'Biomolecules',
          'Biomolecules explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Carbohydrates Monosaccharides Disaccharides Polysaccharides',
          'Proteins Amino Acids Peptide Bond Primary Secondary Tertiary',
          'Lipids Fatty Acids Triglycerides Phospholipids',
          'Nucleic Acids Nucleotides DNA RNA Structure',
          'Enzymes Activation Energy Active Site Factors Affecting Activity',
          'Competitive Inhibition Co-factors Co-enzymes'
        ]
      },
      {
        id: '5-3',
        code: '5.3',
        title: 'Cell Cycle and Cell Division',
        url: 'https://youtu.be/PQhQ80UGwBo?si=YylzjG5BbhO0jIcO',
        videoId: 'PQhQ80UGwBo',
        keywords: [
          'Cell Cycle and Cell Division',
          'Cell Cycle and Cell Division explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Cell Cycle Phases G1 Phase S Phase G2 Phase M Phase G0',
          'Mitosis Prophase Metaphase Anaphase Telophase Cytokinesis',
          'Meiosis I Prophase I Leptotene Zygotene Pachytene Diplotene Diakinesis',
          'Synapsis Synaptonemal Complex Crossing Over Chiasmata',
          'Meiosis II and Significance of Meiosis Genetic Variation'
        ]
      }
    ]
  },
  {
    id: 'internal-organisation-plants',
    number: '6',
    name: 'Internal Organisation of Plants',
    description: 'Plant anatomy, histology, meristematic tissues, simple permanent tissues (parenchyma, collenchyma, sclerenchyma), complex vascular tissues (xylem and phloem), monocot and dicot root, stem, and leaf anatomy, and secondary growth.',
    color: 'from-green-600 to-teal-600',
    badgeColor: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    videos: [
      {
        id: '6-1',
        code: '6.1',
        title: 'Histology and Anatomy of Flowering Plants',
        url: 'https://youtu.be/gspPA0dQFzU?si=hRdeTb1i4dejA8WR',
        videoId: 'gspPA0dQFzU',
        keywords: [
          'Histology and Anatomy of Flowering Plants',
          'Histology and Anatomy of Flowering Plants explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Meristematic Tissues Apical Intercalary Lateral',
          'Simple Permanent Tissues Parenchyma Collenchyma Sclerenchyma',
          'Complex Tissues Xylem Vessels Tracheids Phloem Sieve Tubes',
          'Tissue Systems Epidermal Ground and Vascular Tissue System',
          'Anatomy of Dicot Root and Monocot Root Differences',
          'Anatomy of Dicot Stem and Monocot Stem Differences',
          'Anatomy of Dorsiventral Dicot and Isobilateral Monocot Leaf',
          'Secondary Growth Vascular Cambium Cork Cambium Lenticels'
        ]
      }
    ]
  },
  {
    id: 'plant-ecology',
    number: '7',
    name: 'Plant Ecology',
    description: 'Ecological adaptations of plants (hydrophytes, xerophytes, mesophytes, halophytes), plant community succession (hydrosere and xerosere), pioneer and climax communities, and ecosystem ecological services.',
    color: 'from-teal-600 to-emerald-600',
    badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    videos: [
      {
        id: '7-1',
        code: '7.1',
        title: 'Ecological Adaptation, Succession and Ecological Services',
        url: 'https://youtu.be/NFne7uuJfQ8?si=fGqO3jI0wtnJDP81',
        videoId: 'NFne7uuJfQ8',
        keywords: [
          'Ecological Adaptation, Succession and Ecological Services',
          'Ecological Adaptation, Succession and Ecological Services explanation',
          'important concepts',
          'key concepts and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Hydrophytes Morphological and Anatomical Adaptations Aerenchyma',
          'Xerophytes Morphological and Anatomical Adaptations Sunken Stomata',
          'Mesophytes and Halophytes Pneumatophores Vivipary',
          'Ecological Succession Primary and Secondary Succession',
          'Hydrarch Succession Hydrosere Stages Phytoplankton Submerged Reed Swamp',
          'Xerarch Succession Xerosere Stages Crustose Lichen Foliose Moss Herb Shrub Climax',
          'Pioneer Species Climax Community Seral Stages',
          'Ecological Services Carbon Fixation Oxygen Release Soil Conservation'
        ]
      }
    ]
  }
];

// Helper to normalize strings for flexible search
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

export default function BotanyCurriculum({ onEnroll }) {
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Search and filter logic
  const { filteredVideos, isSearching } = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    const isSearching = trimmedQuery.length > 0;

    let list = ALL_VIDEOS;

    // If not actively searching, filter by tab if a specific tab is chosen
    if (!isSearching && selectedTopicId !== 'all') {
      list = list.filter(v => v.topicId === selectedTopicId);
      return { filteredVideos: list, isSearching };
    }

    // When searching, match across all videos
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

        // Check matching keywords
        const matchedKeywords = (video.keywords || []).filter(kw => {
          const kwNorm = normalize(kw);
          return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
        });

        // Check multi-word token match
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

      // If user has a specific tab selected and results exist within that tab, show tab results
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
    <section 
      id="botany-curriculum" 
      className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      {/* Anchor helper for case-insensitive matching */}
      <span id="Botany-curriculum" className="sr-only">Botany Curriculum Anchor</span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-4 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
            <Sprout size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>INTERMEDIATE 1st YEAR – BOTANY Andhra Pradesh Board</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Botany Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore official chapter-wise video resource sheets, labeled diagram breakdowns, histology cross-sections, cell division mechanics, and floral formulas for guaranteed 60/60 board marks.
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
                  These are sample demo lectures. <strong>Enroll now</strong> to get full access to detailed all chapters, labeled diagram masterclass, 60/60 question banks, and live 1-on-1 faculty doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Botany Full Course - All Chapters Access')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Enroll Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

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
              All Chapters ({ALL_VIDEOS.length})
            </button>
            {TOPICS_DATA.map((topic) => {
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
              placeholder="Search topic or keyword (e.g. Living World, Biomolecules, Histology...)"
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
                Found <strong className="font-bold text-emerald-700 dark:text-emerald-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'video' : 'videos'} for "<em>{searchQuery}</em>"
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching videos found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              Try searching with general keywords like <strong>The Living World</strong>, <strong>Biomolecules</strong>, <strong>Cell Division</strong>, <strong>Plant Kingdom</strong>, or <strong>Histology</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
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
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=600&auto=format&fit=crop';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Chapter / Topic Code Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white font-mono text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
                      <Layers size={12} className="text-emerald-400" />
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
                      <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                        <Leaf size={11} className="shrink-0" />
                        <span className="truncate">{video.topicName}</span>
                      </div>

                      {/* Video Title */}
                      <h3 
                        onClick={() => setActiveVideo(video)}
                        className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer leading-snug mb-2"
                        title={video.title}
                      >
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold mr-1.5">{video.code}</span>
                        {video.title}
                      </h3>

                      {/* Matching Keyword Indicator tag if matched via search */}
                      {isSearching && video.matchedKeyword && (
                        <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200/60 dark:border-emerald-800/60 max-w-full truncate">
                          <Tag size={10} className="shrink-0" />
                          <span className="truncate">Matches: {video.matchedKeyword}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-600/20"
                      >
                        <Play size={14} className="fill-white" /> Watch Now
                      </button>

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Open in YouTube"
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

        {/* Bottom Doubt Clearing & Live Mentorship CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 border border-emerald-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Live 1-on-1 Botany Faculty Assistance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Diagram Practice or Doubt Clearing in Botany?
              </h3>
              <p className="text-emerald-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, step-by-step labeled diagram presentation strategies, histology identification, and chapter-wise question banks for a guaranteed 60/60 in Intermediate Botany.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Botany 1-on-1 Live Doubt & Board Coaching')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25 cursor-pointer"
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
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 shrink-0">
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
                  if (onEnroll) onEnroll(`Botany Doubt: Topic ${current.code} - ${current.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
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
