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
  Dna,
  Bug,
  Activity,
  Eye
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'diversity-living-world',
    number: '1',
    name: 'Diversity of Living World',
    description: 'What is life, nature and scope of zoology, taxonomic classification hierarchy, nomenclature rules, species concept, and biodiversity.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'What is Life?',
        url: 'https://youtu.be/HWVbdS1_RYw?si=bZUkoIebCDCIpaRh',
        videoId: 'HWVbdS1_RYw',
        keywords: [
          'What is Life?',
          'What is Life? explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Characteristics of Living Organisms',
          'Metabolism',
          'Cellular Organization',
          'Consciousness'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Nature, Scope and Meaning of Zoology',
        url: 'https://youtu.be/7Blpztg3LEs?si=HY-FxhMR30LH6wfm',
        videoId: '7Blpztg3LEs',
        keywords: [
          'Nature, Scope and Meaning of Zoology',
          'Nature, Scope and Meaning of Zoology explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Definition of Zoology',
          'Scope of Animal Science',
          'Applications of Zoology'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Branches of Zoology',
        url: 'https://youtu.be/T93j-jRu5vs?si=UhtWuWHKND-yzYoD',
        videoId: 'T93j-jRu5vs',
        keywords: [
          'Branches of Zoology',
          'Branches of Zoology explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Morphology',
          'Anatomy',
          'Physiology',
          'Cytology',
          'Genetics',
          'Evolution',
          'Ecology',
          'Taxonomy'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Need for Classification',
        url: 'https://youtu.be/SNIr2zPd5VI?si=0sfWhR5BFBmTPSD4',
        videoId: 'SNIr2zPd5VI',
        keywords: [
          'Need for Classification',
          'Need for Classification explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Systematics',
          'Identification of Organisms',
          'Evolutionary Relationships',
          'Phylogeny'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'Biological Classification',
        url: 'https://youtu.be/SNIr2zPd5VI?si=0sfWhR5BFBmTPSD4',
        videoId: 'SNIr2zPd5VI',
        keywords: [
          'Biological Classification',
          'Biological Classification explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Two Kingdom vs Five Kingdom',
          'Whittaker Classification',
          'Three Domains of Life'
        ]
      },
      {
        id: '1-6',
        code: '1.6',
        title: 'Levels and Hierarchy of Classification',
        url: 'https://youtu.be/DVouQRAKxYo?si=-7N7KbNz64Ht_sh2',
        videoId: 'DVouQRAKxYo',
        keywords: [
          'Levels and Hierarchy of Classification',
          'Levels and Hierarchy of Classification explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Taxonomic Hierarchy',
          'Kingdom Phylum Class Order Family Genus Species',
          'Taxon and Obligate Categories'
        ]
      },
      {
        id: '1-7',
        code: '1.7',
        title: 'Nomenclature',
        url: 'https://youtu.be/sMg_3NY76UE?si=fnHpxZklNgGf11Ab',
        videoId: 'sMg_3NY76UE',
        keywords: [
          'Nomenclature',
          'Nomenclature explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Binomial Nomenclature',
          'Trinomial Nomenclature',
          'ICZN International Code of Zoological Nomenclature',
          'Scientific Names Rules',
          'Tautonyms'
        ]
      },
      {
        id: '1-8',
        code: '1.8',
        title: 'Species Concept',
        url: 'https://youtu.be/skCHK_5LrhQ?si=wLV2u42e_K0zp20S',
        videoId: 'skCHK_5LrhQ',
        keywords: [
          'Species Concept',
          'Species Concept explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Biological Species Concept',
          'Ernst Mayr Definition',
          'Reproductive Isolation',
          'Typological Species Concept'
        ]
      },
      {
        id: '1-9',
        code: '1.9',
        title: 'Kingdom: Animalia',
        url: 'https://youtu.be/rG6DM1sBzEY?si=ZXFNXmsR_Cwd5Ix7',
        videoId: 'rG6DM1sBzEY',
        keywords: [
          'Kingdom: Animalia',
          'Kingdom Animalia explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Animal Kingdom Overview',
          'Metazoa',
          'Parazoa and Eumetazoa',
          'Heterotrophic Nutrition'
        ]
      },
      {
        id: '1-10',
        code: '1.10',
        title: 'Biodiversity',
        url: 'https://youtu.be/rVZktiOxsww?si=LWnybI89oPEUEnPj',
        videoId: 'rVZktiOxsww',
        keywords: [
          'Biodiversity',
          'Biodiversity explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Genetic Diversity',
          'Species Diversity',
          'Ecological Diversity',
          'Conservation of Biodiversity',
          'Mega Biodiversity Centers'
        ]
      }
    ]
  },
  {
    id: 'structural-organisation',
    number: '2',
    name: 'Structural Organisation in Animals',
    description: 'Cellular, tissue, organ levels of organisation, symmetry patterns, true coelom types, and primary animal tissues.',
    color: 'from-blue-600 to-cyan-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Levels of Organisation',
        url: 'https://youtu.be/a6Ms_TccIL8?si=-DzPtPxd7qf-v8uo',
        videoId: 'a6Ms_TccIL8',
        keywords: [
          'Levels of Organisation',
          'Levels of Organisation explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Cellular Level',
          'Tissue Level',
          'Organ Level',
          'Organ System Level',
          'Division of Labour'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Importance of Symmetry',
        url: 'https://youtu.be/bQLiQ33pV8U?si=LGne43wHBjvP05t7',
        videoId: 'bQLiQ33pV8U',
        keywords: [
          'Importance of Symmetry',
          'Importance of Symmetry explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Asymmetry',
          'Radial Symmetry',
          'Bilateral Symmetry',
          'Cephalization',
          'Biradial Symmetry'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Coelom',
        url: 'https://youtu.be/bHXmjxOekOY?si=9wFbrxF5LKiIaeEf',
        videoId: 'bHXmjxOekOY',
        keywords: [
          'Coelom',
          'Coelom explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Body Cavity',
          'Acoelomate',
          'Pseudocoelomate',
          'Eucoelomate',
          'Schizocoelom',
          'Enterocoelom'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Animal Tissues',
        url: 'https://youtu.be/bHXmjxOekOY?si=9wFbrxF5LKiIaeEf',
        videoId: 'bHXmjxOekOY',
        keywords: [
          'Animal Tissues',
          'Animal Tissues explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Epithelial Tissue',
          'Connective Tissue',
          'Muscular Tissue',
          'Nervous Tissue',
          'Histology',
          'Cell Junctions'
        ]
      }
    ]
  },
  {
    id: 'animal-diversity-1',
    number: '3',
    name: 'Animal Diversity – I (Invertebrate Phyla)',
    description: 'Comprehensive study of non-chordate invertebrate phyla: Porifera, Cnidaria, Ctenophora, Platyhelminthes, Nematoda, Annelida, Arthropoda, Mollusca, Echinodermata, and Hemichordata.',
    color: 'from-violet-600 to-purple-600',
    badgeColor: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Phylum – Porifera',
        url: 'https://youtu.be/5fUBDoQ3zYg?si=kP-nh8HT4hyv7nVS',
        videoId: '5fUBDoQ3zYg',
        keywords: [
          'Phylum – Porifera',
          'Phylum Porifera explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Sponges',
          'Canal System',
          'Choanocytes or Collar Cells',
          'Spicules and Spongin Fibres',
          'Osculum and Ostia',
          'Sycon Spongilla Euspongia'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Phylum – Cnidaria',
        url: 'https://youtu.be/owLiWglZ1-4?si=M8RObrsMvtsvdIDO',
        videoId: 'owLiWglZ1-4',
        keywords: [
          'Phylum – Cnidaria',
          'Phylum Cnidaria explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Coelenterata',
          'Cnidocytes Nematocysts',
          'Polyp and Medusa',
          'Metagenesis Alternation of Generation',
          'Hydra Obelia Aurelia Physalia'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'Phylum – Ctenophora',
        url: 'https://youtu.be/wb2xz87GfwI?si=R7TJllfjw--yymJw',
        videoId: 'wb2xz87GfwI',
        keywords: [
          'Phylum – Ctenophora',
          'Phylum Ctenophora explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Comb Jellies',
          'Sea Walnuts',
          '8 Ciliated Comb Plates',
          'Bioluminescence',
          'Colloblasts',
          'Pleurobrachia Ctenoplana'
        ]
      },
      {
        id: '3-4',
        code: '3.4',
        title: 'Phylum – Platyhelminthes',
        url: 'https://youtu.be/fWVMKLsRE6s?si=hQuIjhujSSggSY-q',
        videoId: 'fWVMKLsRE6s',
        keywords: [
          'Phylum – Platyhelminthes',
          'Phylum Platyhelminthes explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Flatworms',
          'Dorso-ventrally Flattened Body',
          'Flame Cells Solenocytes',
          'Hooks and Suckers',
          'Taenia solium Tapeworm',
          'Fasciola hepatica Liver Fluke',
          'Planaria'
        ]
      },
      {
        id: '3-5',
        code: '3.5',
        title: 'Phylum – Nematoda',
        url: 'https://youtu.be/hm9olv4tJFk?si=i0uZaxsK9eU9tQhr',
        videoId: 'hm9olv4tJFk',
        keywords: [
          'Phylum – Nematoda',
          'Phylum Nematoda explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Aschelminthes Roundworms',
          'Pseudocoelomate Animals',
          'Muscular Pharynx',
          'Sexual Dimorphism',
          'Ascaris lumbricoides',
          'Wuchereria bancrofti Filarial Worm',
          'Ancylostoma Hookworm'
        ]
      },
      {
        id: '3-6',
        code: '3.6',
        title: 'Phylum – Annelida',
        url: 'https://youtu.be/McxNejiYR50?si=cJ5nBePIPTuPOpxZ',
        videoId: 'McxNejiYR50',
        keywords: [
          'Phylum – Annelida',
          'Phylum Annelida explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Segmented Worms',
          'Metameric Segmentation',
          'Nephridia for Excretion',
          'Parapodia and Setae',
          'Closed Circulatory System',
          'Pheretima Earthworm',
          'Hirudinaria Leech',
          'Nereis'
        ]
      },
      {
        id: '3-7',
        code: '3.7',
        title: 'Phylum – Arthropoda',
        url: 'https://youtu.be/RXWoDcIZbxY?si=xeTIKYJOIwJC6nKe',
        videoId: 'RXWoDcIZbxY',
        keywords: [
          'Phylum – Arthropoda',
          'Phylum Arthropoda explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Largest Phylum of Animalia',
          'Jointed Appendages',
          'Chitinous Exoskeleton',
          'Malpighian Tubules',
          'Open Circulatory System Haemocoel',
          'Statocysts and Compound Eyes',
          'Insects Crustaceans Arachnids'
        ]
      },
      {
        id: '3-8',
        code: '3.8',
        title: 'Phylum – Mollusca',
        url: 'https://youtu.be/RExg1KgWmpA?si=D-G8ykrmJt3atWXY',
        videoId: 'RExg1KgWmpA',
        keywords: [
          'Phylum – Mollusca',
          'Phylum Mollusca explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Second Largest Phylum',
          'Soft-Bodied Animals Shell',
          'Mantle and Mantle Cavity',
          'Radula Rasping Organ',
          'Ctenidia Feather Gills',
          'Pila Apple Snail',
          'Octopus Devil Fish',
          'Pinctada Pearl Oyster'
        ]
      },
      {
        id: '3-9',
        code: '3.9',
        title: 'Phylum – Echinodermata',
        url: 'https://youtu.be/-Ka1nAMpGSM?si=anbRTRnaeXdqpc-f',
        videoId: '-Ka1nAMpGSM',
        keywords: [
          'Phylum – Echinodermata',
          'Phylum Echinodermata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Spiny Skinned Animals',
          'Water Vascular Ambulacral System',
          'Tube Feet Locomotion',
          'Radial Symmetry in Adults Bilateral in Larvae',
          'Asterias Starfish',
          'Echinus Sea Urchin',
          'Cucumaria Sea Cucumber'
        ]
      },
      {
        id: '3-10',
        code: '3.10',
        title: 'Phylum – Hemichordata',
        url: 'https://youtu.be/VrLv5g9E1w4?si=_6QbqcBE8VHIp3jq',
        videoId: 'VrLv5g9E1w4',
        keywords: [
          'Phylum – Hemichordata',
          'Phylum Hemichordata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Worm-like Marine Animals',
          'Proboscis Collar and Trunk',
          'Stomochord Buccal Diverticulum',
          'Proboscis Gland Excretion',
          'Balanoglossus Acorn Worm',
          'Saccoglossus',
          'Tornaria Larva'
        ]
      }
    ]
  },
  {
    id: 'animal-diversity-2',
    number: '4',
    name: 'Animal Diversity – II (Chordata)',
    description: 'Fundamental chordate characters, protochordates (urochordates, cephalochordates), cyclostomes, cartilaginous and bony fishes, and tetrapod classes.',
    color: 'from-indigo-600 to-blue-600',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Phylum – Chordata',
        url: 'https://youtu.be/2iwOPEGVHVY?si=OMgZb_4ByFj2qNpT',
        videoId: '2iwOPEGVHVY',
        keywords: [
          'Phylum – Chordata',
          'Phylum Chordata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Notochord Presence',
          'Dorsal Hollow Nerve Cord',
          'Pharyngeal Gill Slits',
          'Post-Anal Tail',
          'Chordates vs Non-Chordates Comparison'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'Subphylum – Urochordata or Tunicata',
        url: 'https://youtu.be/jV8mIXuWwUA?si=OYWk4x6aufad6Xeh',
        videoId: 'jV8mIXuWwUA',
        keywords: [
          'Subphylum – Urochordata or Tunicata',
          'Subphylum Urochordata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Tunic or Test Covering Tunicin',
          'Notochord in Larval Tail Only',
          'Retrogressive Metamorphosis',
          'Ascidia',
          'Salpa',
          'Doliolum'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'Subphylum – Cephalochordata',
        url: 'https://youtu.be/2iwOPEGVHVY?si=LkQHlFmsLCTpX6rN',
        videoId: '2iwOPEGVHVY',
        keywords: [
          'Subphylum – Cephalochordata',
          'Subphylum Cephalochordata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Notochord Extends from Head to Tail',
          'Persistent Notochord Throughout Life',
          'Branchiostoma Amphioxus Lancelet',
          'Filter Feeding'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'Subphylum – Vertebrata / Craniata',
        url: 'https://youtu.be/hvipDjcLehw?si=ILG-BxnKgAEVtIyO',
        videoId: 'hvipDjcLehw',
        keywords: [
          'Subphylum – Vertebrata / Craniata',
          'Subphylum Vertebrata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Vertebral Column Replaces Notochord',
          'Cranium Brain Box',
          'Muscular Heart Chambers',
          'Kidneys for Excretion and Osmoregulation',
          'All Vertebrates are Chordates'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'Superclass – Agnatha',
        url: 'https://youtu.be/B-AsJA2Meqo?si=OPXj88yN5AXfob_S',
        videoId: 'B-AsJA2Meqo',
        keywords: [
          'Superclass – Agnatha',
          'Superclass Agnatha explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Jawless Vertebrates',
          'Class Cyclostomata',
          'Circular Sucking Mouth',
          'Absence of Paired Fins and Scales',
          'Petromyzon Lamprey',
          'Myxine Hagfish',
          'Anadromous Migration'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'Superclass – Gnathostomata',
        url: 'https://youtu.be/Hl6BWU8gAfo?si=puhniRLzpLiaem9F',
        videoId: 'Hl6BWU8gAfo',
        keywords: [
          'Superclass – Gnathostomata',
          'Superclass Gnathostomata explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Jawed Vertebrates',
          'Class Chondrichthyes Cartilaginous Fishes Placoid Scales',
          'Class Osteichthyes Bony Fishes Cycloid Ctenoid Scales',
          'Air Bladder Operculum Clasper organs'
        ]
      },
      {
        id: '4-7',
        code: '4.7',
        title: 'Tetrapoda',
        url: 'https://youtu.be/CP4NsbLbLf4?si=-jOv4rRVjLLyfbvR',
        videoId: 'CP4NsbLbLf4',
        keywords: [
          'Tetrapoda',
          'Tetrapoda explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Four-Limbed Vertebrates',
          'Class Amphibia Dual Life Moist Skin Tympanum',
          'Class Reptilia Creeping Poikilotherms Cleidoic Eggs',
          'Class Aves Feathers Pneumatic Bones Flight',
          'Class Mammalia Mammary Glands Hair Corpus Callosum'
        ]
      }
    ]
  },
  {
    id: 'locomotion-reproduction',
    number: '5',
    name: 'Locomotion and Reproduction',
    description: 'Mechanisms of protozoan locomotion, amoeboid sol-gel theories, 9+2 flagellar ultrastructure, ciliary waves, asexual fission, and sexual conjugation.',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '5-1',
        code: '5.1',
        title: 'Locomotion in Protozoa',
        url: 'https://youtu.be/nUZpO8bSmuI?si=BvPeaRGg81ufkf1u',
        videoId: 'nUZpO8bSmuI',
        keywords: [
          'Locomotion in Protozoa',
          'Locomotion in Protozoa explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Pseudopodial Locomotion',
          'Types of Pseudopodia Lobopodia Filopodia',
          'Sol-Gel Theory of Hyman and Mast',
          'Surface Tension Theory',
          'Amoeba proteus'
        ]
      },
      {
        id: '5-2',
        code: '5.2',
        title: 'Flagellar and Ciliary Movement',
        url: 'https://youtu.be/wEtRevG3c6I?si=IkQL3wGh9OP8eJFE',
        videoId: 'wEtRevG3c6I',
        keywords: [
          'Flagellar and Ciliary Movement',
          'Flagellar and Ciliary Movement explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Ultrastructure of Flagellum 9+2 Axoneme',
          'Dynein Arms and Nexin Links',
          'Effective Stroke and Recovery Stroke',
          'Metachronal and Synchronal Rhythms',
          'Euglena and Paramecium Locomotion'
        ]
      },
      {
        id: '5-3',
        code: '5.3',
        title: 'Asexual Reproduction',
        url: 'https://youtu.be/co5jZId0F-g?si=bWIwrNbPKwOhZ5pP',
        videoId: 'co5jZId0F-g',
        keywords: [
          'Asexual Reproduction',
          'Asexual Reproduction explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Binary Fission Simple Transverse Longitudinal',
          'Multiple Fission Schizogony Sporogony',
          'Budding and Encystment',
          'Reproduction in Amoeba and Euglena'
        ]
      },
      {
        id: '5-4',
        code: '5.4',
        title: 'Sexual Reproduction',
        url: 'https://youtu.be/HP21hIVJhWI?si=iMs2i53GoZZQ-knb',
        videoId: 'HP21hIVJhWI',
        keywords: [
          'Sexual Reproduction',
          'Sexual Reproduction explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Conjugation in Paramecium aurelia',
          'Macronucleus and Micronucleus Behavior',
          'Nuclear Exchange and Synkaryon Formation',
          'Post-Conjugation Fissions',
          'Syngamy Types Isogamy Anisogamy'
        ]
      }
    ]
  },
  {
    id: 'biology-human-welfare',
    number: '6',
    name: 'Biology in Human Welfare',
    description: 'Parasitic adaptations, protozoan and helminthic human pathogens (Plasmodium, Entamoeba, Ascaris, Wuchereria), epidemiology, and substance abuse control.',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '6-1',
        code: '6.1',
        title: 'Parasitism and Parasitic Adaptations',
        url: 'https://youtu.be/eL9ZDH8wCNI?si=VezHxXpaH79CuZQY',
        videoId: 'eL9ZDH8wCNI',
        keywords: [
          'Parasitism and Parasitic Adaptations',
          'Parasitism and Parasitic Adaptations explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Ectoparasites and Endoparasites',
          'Hyperparasitism',
          'Morphological and Physiological Adaptations',
          'Loss of Unnecessary Sense Organs and Digestive System',
          'High Reproductive Potential'
        ]
      },
      {
        id: '6-2',
        code: '6.2',
        title: 'Health and Disease',
        url: 'https://youtu.be/jXcUaLPivVU?si=pDfjl84wtUHjQWwk',
        videoId: 'jXcUaLPivVU',
        keywords: [
          'Health and Disease',
          'Health and Disease explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Plasmodium vivax Life Cycle in Man and Female Anopheles',
          'Hepatic and Erythrocytic Schizogony',
          'Haemozoin Malarial Paroxysm',
          'Entamoeba histolytica Trophozoite Amoebic Dysentery'
        ]
      },
      {
        id: '6-3',
        code: '6.3',
        title: 'Brief Account of Some Other Diseases',
        url: 'https://youtu.be/jXcUaLPivVU?si=zonYSWqZ0d5R2q0L',
        videoId: 'jXcUaLPivVU',
        keywords: [
          'Brief Account of Some Other Diseases',
          'Brief Account of Some Other Diseases explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Ascaris lumbricoides Ascariasis Life Cycle',
          'Wuchereria bancrofti Filariasis Elephantiasis',
          'Culex Mosquito Vector',
          'Typhoid Salmonella typhi Widal Test',
          'Pneumonia Streptococcus pneumoniae'
        ]
      },
      {
        id: '6-4',
        code: '6.4',
        title: 'Tobacco, Drugs and Alcohol Abuse',
        url: 'https://youtu.be/EOaKYCbz_Ac?si=Q2-bxs-RAWOr2UFE',
        videoId: 'EOaKYCbz_Ac',
        keywords: [
          'Tobacco, Drugs and Alcohol Abuse',
          'Tobacco, Drugs and Alcohol Abuse explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Opioids Morphine Heroin Smack',
          'Cannabinoids Charas Ganja Bhang Marijuana',
          'Coca Alkaloids Cocaine Crack',
          'Hallucinogens LSD Datura Atropa belladonna',
          'Addiction Dependence Withdrawal Syndrome Cirrhosis'
        ]
      }
    ]
  },
  {
    id: 'periplaneta-americana',
    number: '7',
    name: 'Periplaneta Americana (Cockroach)',
    description: 'In-depth anatomy and physiology of Periplaneta americana: external morphology, locomotion, digestion, circulation, respiration, excretion, nervous system, and reproduction.',
    color: 'from-red-600 to-rose-600',
    badgeColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    videos: [
      {
        id: '7-1',
        code: '7.1',
        title: 'Habitat and Habits',
        url: 'https://youtu.be/qPIZuDGAyvg?si=1zF3VRBVaJsQ7pGa',
        videoId: 'qPIZuDGAyvg',
        keywords: [
          'Habitat and Habits',
          'Habitat and Habits explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Periplaneta americana',
          'Nocturnal Omnivorous Cursorial Habitat',
          'Damp Warm Dark Places',
          'Sanitary Importance and Pest Status'
        ]
      },
      {
        id: '7-2',
        code: '7.2',
        title: 'External Features (Morphology)',
        url: 'https://youtu.be/HTNwklienyY?si=i8ZHUgYEboHc3NtF',
        videoId: 'HTNwklienyY',
        keywords: [
          'External Features (Morphology)',
          'External Features Morphology explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Head Thorax and Abdomen',
          'Exoskeleton Chitinous Sclerites Tergum Sternum',
          'Hypognathous Head and Compound Eyes',
          'Biting and Chewing Mouthparts Labrum Mandibles Maxillae Labium Hypopharynx',
          'Tegmina and Metathoracic Flight Wings',
          'Anal Styles and Anal Cerci Sexual Dimorphism'
        ]
      },
      {
        id: '7-3',
        code: '7.3',
        title: 'Locomotion',
        url: 'https://youtu.be/titC9ozU1v8?si=BdCJpO7nOp4fio4W',
        videoId: 'titC9ozU1v8',
        keywords: [
          'Locomotion',
          'Locomotion explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Walking Legs Podomeres Coxa Trochanter Femur Tibia Tarsus',
          'Pretarsus Claws and Arolium Plantulae',
          'Tripod Mechanism of Walking',
          'Flight Muscles and Wing Movement'
        ]
      },
      {
        id: '7-4',
        code: '7.4',
        title: 'Digestive System',
        url: 'https://youtu.be/ZBZWgrfZFbU?si=Savrrg792zAHJq__',
        videoId: 'ZBZWgrfZFbU',
        keywords: [
          'Digestive System',
          'Digestive System explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Alimentary Canal Foregut Stomodaeum Midgut Mesenteron Hindgut Proctodaeum',
          'Pharynx Oesophagus Crop Gizzard Proventriculus Chitinous Teeth',
          'Hepatic Caeca Digestive Enzymes',
          'Ileum Colon Rectum and Rectal Papillae'
        ]
      },
      {
        id: '7-5',
        code: '7.5',
        title: 'Circulatory System',
        url: 'https://youtu.be/SwHjwO7BnsI?si=SNkgzaftr5s-HAHk',
        videoId: 'SwHjwO7BnsI',
        keywords: [
          'Circulatory System',
          'Circulatory System explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Open Circulatory System Haemocoel',
          '13 Chambered Tubular Heart Ostia',
          '12 Pairs of Alary Muscles',
          'Pericardial Perivisceral and Perineural Sinuses',
          'Haemolymph and Plasma Haemocytes'
        ]
      },
      {
        id: '7-6',
        code: '7.6',
        title: 'Respiratory System',
        url: 'https://youtu.be/mOKmjYwfDGU?si=7FOJNfXHm8I-LRK5',
        videoId: 'mOKmjYwfDGU',
        keywords: [
          'Respiratory System',
          'Respiratory System explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Tracheal System',
          '10 Pairs of Spiracles Stigmata',
          'Tracheae and Tracheoles Taenidia Spiral Cuticular Rings',
          'Direct Tissue Respiration without Respiratory Pigment'
        ]
      },
      {
        id: '7-7',
        code: '7.7',
        title: 'Excretory System',
        url: 'https://youtu.be/q5qaGHfdmYM?si=8q-LM58K5S7htUri',
        videoId: 'q5qaGHfdmYM',
        keywords: [
          'Excretory System',
          'Excretory System explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Malpighian Tubules Yellow Fine Filaments',
          'Uricotelic Excretion Uric Acid Crystals',
          'Fat Body Cells Trophocytes Mycetocytes Oenocytes Urate Cells',
          'Nephrocytes and Urecose Glands'
        ]
      },
      {
        id: '7-8',
        code: '7.8',
        title: 'Nervous System and Sense Organs',
        url: 'https://youtu.be/RNLceVI8jcc?si=NsyD3q9-xu5VTMpx',
        videoId: 'RNLceVI8jcc',
        keywords: [
          'Nervous System and Sense Organs',
          'Nervous System and Sense Organs explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Nerve Ring Supra-oesophageal and Sub-oesophageal Ganglia',
          'Double Ventral Nerve Cord 9 Ganglia 3 Thoracic 6 Abdominal',
          'Compound Eyes 2000 Ommatidia Mosaic Vision Apposition',
          'Antennae Tactile and Olfactory Receptors',
          'Anal Cerci Thigmo and Auditory Receptors'
        ]
      },
      {
        id: '7-9',
        code: '7.9',
        title: 'Reproductive System',
        url: 'https://youtu.be/als-gv_D7bc?si=OHm4BWtdWTEkTfKe',
        videoId: 'als-gv_D7bc',
        keywords: [
          'Reproductive System',
          'Reproductive System explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Male Reproductive System Testes Vas Deferens Ejaculatory Duct',
          'Mushroom Gland Utricular Gland and Phallic Gland Conglobate',
          'Female Reproductive System Ovaries 8 Ovarioles Oviduct Vagina',
          'Spermatheca and Collaterial Glands',
          'Ootheca Egg Capsule and Paurometabolous Development Nymph Instars'
        ]
      }
    ]
  },
  {
    id: 'ecology-environment',
    number: '8',
    name: 'Ecology and Environment',
    description: 'Ecological hierarchy, abiotic adaptations, community and population dynamics, food chains, energy flow pyramids, nutrient biogeochemical cycles, and environmental protection.',
    color: 'from-teal-600 to-emerald-600',
    badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    videos: [
      {
        id: '8-1',
        code: '8.1',
        title: 'Organisms and Environment',
        url: 'https://youtu.be/sKJoXdrOT70?si=0P76wIohJ_BSH_7j',
        videoId: 'sKJoXdrOT70',
        keywords: [
          'Organisms and Environment',
          'Organisms and Environment explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Abiotic Factors Temperature Water Light Soil',
          'Regulators and Conformers Homeostasis',
          'Migration and Suspension Hibernation Aestivation Diapause',
          'Morphological Physiological Behavioral Adaptations',
          'Allen Rule Bergmann Rule'
        ]
      },
      {
        id: '8-2',
        code: '8.2',
        title: 'Ecosystem – Elementary Aspects',
        url: 'https://youtu.be/sKJoXdrOT70?si=ma598FBOYyMJDSF0',
        videoId: 'sKJoXdrOT70',
        keywords: [
          'Ecosystem – Elementary Aspects',
          'Ecosystem Elementary Aspects explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Ecosystem Structure and Function',
          'Productivity GPP Gross Primary Productivity NPP Net Primary Productivity',
          'Decomposition Fragmentation Leaching Catabolism Humification Mineralisation',
          'Stratification in Pond and Forest Ecosystem'
        ]
      },
      {
        id: '8-3',
        code: '8.3',
        title: 'Population Interactions',
        url: 'https://youtu.be/BOvgFsSMauQ?si=62kFRbiKZHzsMraC',
        videoId: 'BOvgFsSMauQ',
        keywords: [
          'Population Interactions',
          'Population Interactions explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Mutualism Lichens Mycorrhizae Fig and Wasp',
          'Commensalism Epiphytes Barnacles on Whale Cattle Egret',
          'Parasitism Brood Parasitism Cuckoo',
          'Predation Biological Control',
          'Competition Gause Competitive Exclusion Principle Resource Partitioning',
          'Amensalism Penicillium Antibiosis'
        ]
      },
      {
        id: '8-4',
        code: '8.4',
        title: 'Ecosystems and Their Components',
        url: 'https://youtu.be/sKJoXdrOT70?si=v0baGvVb0rkW2pOj',
        videoId: 'sKJoXdrOT70',
        keywords: [
          'Ecosystems and Their Components',
          'Ecosystems and Their Components explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Biotic Components Producers Consumers Decomposers',
          'Abiotic Components Climatic and Edaphic',
          'Pond Ecosystem Aquatic Life Trophic Levels',
          'Terrestrial and Aquatic Biomes'
        ]
      },
      {
        id: '8-5',
        code: '8.5',
        title: 'Food Chains, Food Web, Productivity and Energy Flow',
        url: 'https://youtu.be/j78g5iRnYBM?si=FwbAm7DKD6H-tCK8',
        videoId: 'j78g5iRnYBM',
        keywords: [
          'Food Chains, Food Web, Productivity and Energy Flow',
          'Food Chains and Food Web explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Grazing Food Chain GFC',
          'Detritus Food Chain DFC',
          'Food Web Complexity and Ecosystem Stability',
          'Lindeman 10 Percent Law of Energy Flow',
          'Ecological Pyramids Number Biomass Energy Upright Inverted'
        ]
      },
      {
        id: '8-6',
        code: '8.6',
        title: 'Nutrient Cycles',
        url: 'https://youtu.be/uip4Q6t7yfQ?si=Dls-MEI1z9Hb4Re3',
        videoId: 'uip4Q6t7yfQ',
        keywords: [
          'Nutrient Cycles',
          'Nutrient Cycles explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Biogeochemical Cycling',
          'Gaseous Cycles Carbon Cycle Nitrogen Cycle',
          'Sedimentary Cycles Phosphorus Cycle',
          'Ecosystem Services Robert Costanza Valuation'
        ]
      },
      {
        id: '8-7',
        code: '8.7',
        title: 'Population',
        url: 'https://youtu.be/bprJbGy_EQc?si=vYMAOMl24qvB8-wq',
        videoId: 'bprJbGy_EQc',
        keywords: [
          'Population',
          'Population explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Population Attributes Density Natality Mortality Sex Ratio',
          'Age Pyramids Expanding Stable Declining',
          'Exponential J-shaped Growth Model',
          'Logistic S-shaped Sigmoid Growth Verhulst-Pearl Carrying Capacity K'
        ]
      },
      {
        id: '8-8',
        code: '8.8',
        title: 'Environmental Issues',
        url: 'https://youtu.be/7qkaz8ChelI?si=y-ffgJSZ5PaTBV73',
        videoId: '7qkaz8ChelI',
        keywords: [
          'Environmental Issues',
          'Environmental Issues explanation',
          'important concepts',
          'classification and characteristics',
          'examples',
          'labelled diagrams',
          'differences and comparisons',
          'important exam questions',
          'Air Pollution Electrostatic Precipitator Catalytic Converter',
          'Water Pollution BOD Biochemical Oxygen Demand Eutrophication',
          'Biomagnification DDT Mercury',
          'Solid and Radioactive Waste E-waste Plastic Recycling',
          'Greenhouse Effect Global Warming Ozone Depletion Dobson Units',
          'Deforestation Chipko Movement Joint Forest Management JFM'
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

export default function ZoologyCurriculum({ onEnroll }) {
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

    // When searching, match across ALL topics or current selected tab
    if (isSearching) {
      const rawLower = trimmedQuery.toLowerCase();
      const normQ = normalize(trimmedQuery);
      const queryTokens = normQ.split(' ').filter(Boolean);

      const matches = ALL_VIDEOS.map(video => {
        // Collect all text sources
        const titleNorm = normalize(video.title);
        const codeNorm = normalize(video.code);
        const topicNorm = normalize(video.topicName);
        const keywordsNorm = (video.keywords || []).map(k => normalize(k));

        // Check if raw or normalized query matches title, code, or topic
        const directTitleMatch = video.title.toLowerCase().includes(rawLower) || titleNorm.includes(normQ);
        const directCodeMatch = video.code.toLowerCase().includes(rawLower) || codeNorm.includes(normQ);
        const directTopicMatch = video.topicName.toLowerCase().includes(rawLower) || topicNorm.includes(normQ);

        // Check matching keywords
        const matchedKeywords = (video.keywords || []).filter(kw => {
          const kwNorm = normalize(kw);
          return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
        });

        // Check multi-word token match (e.g. "cockroach digestion", "water vascular", "sol gel")
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

      // If user has a specific tab selected and results exist within that tab, show them; otherwise show all matches
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
      id="zoology-curriculum" 
      className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800"
    >
      {/* Anchor helper for uppercase Zoology-curriculum */}
      <div id="Zoology-curriculum" className="sr-only" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-4 border border-emerald-200/60 dark:border-emerald-800/60">
            <Tv size={15} />
            <span>AP & TS Intermediate Zoology Video Lectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Zoology Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore topic-by-topic concept explanations, animal diversity classifications, anatomy breakdowns, histology diagrams, and high-yield board exam questions.
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
                  These are sample demo videos. <strong>Enroll now</strong> to get full access to detailed all chapters, histology and dissection diagrams, and live 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Zoology Full Course - All Chapters Access')}
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
              placeholder="Search topic or keyword (e.g. Porifera, Cockroach, Coelom, Plasmodium...)"
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
              Try searching with general keywords like <strong>Porifera</strong>, <strong>Cockroach</strong>, <strong>Coelom</strong>, <strong>Chordata</strong>, or <strong>Ecosystem</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Search & View All ({ALL_VIDEOS.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredVideos.map((video) => {
              return (
                <div
                  key={video.id}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Thumbnail Container */}
                  <div 
                    className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => setActiveVideo(video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Topic Code Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20">
                      Topic {video.code}
                    </div>

                    {/* Central Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500 backdrop-blur-xs">
                        <Play size={20} className="fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Topic Tag */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        <Dna size={11} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
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
                <span>Live 1-on-1 Zoology Faculty Assistance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Diagram Practice or Doubt Clearing in Zoology?
              </h3>
              <p className="text-emerald-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, cockroach dissection and labeled diagram drawing strategies, histology identification, and chapter-wise question banks for a guaranteed 60/60 in Intermediate Zoology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Zoology 1-on-1 Live Doubt & Board Coaching')}
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
                  if (onEnroll) onEnroll(`Zoology Doubt: Topic ${current.code} - ${current.title}`);
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
