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
  FlaskConical,
  Atom
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'basic-concepts',
    number: '1',
    name: 'Some Basic Concepts of Chemistry',
    description: 'Importance of chemistry, nature of matter, uncertainty in measurement, laws of chemical combinations, Dalton’s theory, mole concept, and stoichiometry.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'Importance of Chemistry',
        url: 'https://youtu.be/IKvwFBYcJzs',
        videoId: 'IKvwFBYcJzs',
        keywords: [
          'Importance of Chemistry',
          'Scope of Chemistry',
          'Role of Chemistry in Daily Life',
          'Branches of Chemistry',
          'Applied Chemistry',
          'Pharmaceuticals and Chemistry',
          'Chemistry in Agriculture',
          'Basic Principles of Chemistry'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Nature of Matter',
        url: 'https://youtu.be/4ylWWOTI4HA',
        videoId: '4ylWWOTI4HA',
        keywords: [
          'Nature of Matter',
          'States of Matter',
          'Solid Liquid Gas',
          'Classification of Matter',
          'Pure Substances and Mixtures',
          'Homogeneous Mixture',
          'Heterogeneous Mixture',
          'Elements and Compounds',
          'Physical and Chemical Classification'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Properties of Matter and Their Measurement',
        url: 'https://youtu.be/pKvo0XWZtjo',
        videoId: 'pKvo0XWZtjo',
        keywords: [
          'Properties of Matter',
          'Physical and Chemical Properties',
          'Measurement of Matter',
          'SI Units of Measurement',
          'Fundamental Units',
          'Derived Units',
          'Mass and Weight',
          'Density and Volume',
          'Temperature Scales',
          'Kelvin Celsius Fahrenheit Conversion'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Uncertainty in Measurement',
        url: 'https://youtu.be/b881nOem4vg',
        videoId: 'b881nOem4vg',
        keywords: [
          'Uncertainty in Measurement',
          'Scientific Notation',
          'Exponential Notation',
          'Precision and Accuracy',
          'Significant Figures',
          'Rules for Significant Figures',
          'Rounding Off Numbers',
          'Dimensional Analysis',
          'Unit Factor Method'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'Laws of Chemical Combinations',
        url: 'https://youtu.be/FFEznW5TWIg',
        videoId: 'FFEznW5TWIg',
        keywords: [
          'Laws of Chemical Combinations',
          'Law of Conservation of Mass',
          'Law of Definite Proportions',
          'Law of Multiple Proportions',
          'Gay Lussacs Law of Gaseous Volumes',
          'Avogadros Law',
          'Chemical Combination Principles',
          'Lavoisier and Proust Laws'
        ]
      },
      {
        id: '1-6',
        code: '1.6',
        title: 'Dalton’s Atomic Theory',
        url: 'https://youtu.be/syi3pXJNe58',
        videoId: 'syi3pXJNe58',
        keywords: [
          'Daltons Atomic Theory',
          'Postulates of Dalton Atomic Theory',
          'Indivisibility of Atom',
          'Atomic Hypothesis',
          'Explanation of Chemical Combination Laws',
          'Limitations of Dalton Theory',
          'Modern Atomic Theory Comparison'
        ]
      },
      {
        id: '1-7',
        code: '1.7',
        title: 'Atomic and Molecular Masses',
        url: 'https://youtu.be/a0r_98_vPdg',
        videoId: 'a0r_98_vPdg',
        keywords: [
          'Atomic Mass',
          'Molecular Mass',
          'Average Atomic Mass',
          'Isotopic Abundance',
          'Formula Mass',
          'Atomic Mass Unit amu',
          'Unified Mass u',
          'Carbon 12 Standard Reference',
          'Calculation of Molecular Mass'
        ]
      },
      {
        id: '1-8',
        code: '1.8',
        title: 'Mole Concept and Molar Masses',
        url: 'https://youtu.be/idl0XHhSyMw',
        videoId: 'idl0XHhSyMw',
        keywords: [
          'Mole Concept',
          'Avogadro Constant',
          'Avogadro Number 6.022 x 10^23',
          'Molar Mass',
          'Gram Atomic Mass',
          'Gram Molecular Mass',
          'Number of Moles Formula',
          'Molar Volume of Gas at STP',
          '22.4 Litres STP',
          'Mole Calculations and Numerical Problems'
        ]
      },
      {
        id: '1-9',
        code: '1.9',
        title: 'Percentage Composition',
        url: 'https://youtu.be/bGmbyztdCHE',
        videoId: 'bGmbyztdCHE',
        keywords: [
          'Percentage Composition',
          'Mass Percentage of Elements',
          'Mass Percent Formula',
          'Percent Composition Problems',
          'Elemental Composition Analysis',
          'Mass of Element in Compound'
        ]
      },
      {
        id: '1-10',
        code: '1.10',
        title: 'Empirical and Molecular Formulae',
        url: 'https://youtu.be/wMRyMrEkYoM',
        videoId: 'wMRyMrEkYoM',
        keywords: [
          'Empirical Formula',
          'Molecular Formula',
          'Determination of Empirical Formula',
          'Simplest Whole Number Ratio',
          'Relation Between Empirical and Molecular Formula',
          'n Factor Molecular Weight by Empirical Weight',
          'Empirical Formula Problems Step by Step'
        ]
      },
      {
        id: '1-11',
        code: '1.11',
        title: 'Stoichiometry and Stoichiometric Calculations',
        url: 'https://youtu.be/guuo5P9p-XU',
        videoId: 'guuo5P9p-XU',
        keywords: [
          'Stoichiometry',
          'Stoichiometric Calculations',
          'Balancing Chemical Equations',
          'Limiting Reagent',
          'Excess Reagent',
          'Mole Mole Relationship',
          'Mass Mass Relationship',
          'Mass Volume Calculations',
          'Concentration Terms',
          'Molarity M',
          'Molality m',
          'Normality N',
          'Mole Fraction',
          'Percentage by Mass'
        ]
      }
    ]
  },
  {
    id: 'structure-of-atom',
    number: '2',
    name: 'Structure of Atom',
    description: 'Sub-atomic particles, Thomson & Rutherford models, Bohr hydrogen model, dual nature of matter, Heisenberg principle, and quantum mechanical orbitals.',
    color: 'from-teal-600 to-cyan-600',
    badgeColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Discovery of Sub-Atomic Particles',
        url: 'https://youtu.be/0_RQ9wb2ZPg',
        videoId: '0_RQ9wb2ZPg',
        keywords: [
          'Discovery of Sub-Atomic Particles',
          'Discovery of Electron',
          'Cathode Ray Discharge Tube Experiment',
          'Properties of Cathode Rays',
          'Charge to Mass Ratio of Electron e/m',
          'Millikan Oil Drop Experiment',
          'Charge on Electron',
          'Discovery of Proton',
          'Anode Rays Canal Rays',
          'Discovery of Neutron Chadwick'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Atomic Models',
        url: 'https://youtu.be/v48u8hjqNBU',
        videoId: 'v48u8hjqNBU',
        keywords: [
          'Atomic Models',
          'Thomson Model of Atom',
          'Plum Pudding Model',
          'Rutherford Alpha Particle Scattering Experiment',
          'Geiger Marsden Experiment',
          'Rutherford Nuclear Model of Atom',
          'Discovery of Nucleus',
          'Drawbacks and Limitations of Rutherford Model'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Developments Leading to the Bohr’s Model of Atom',
        url: 'https://youtu.be/WgJbBcVFI2I',
        videoId: 'WgJbBcVFI2I',
        keywords: [
          'Developments Leading to Bohrs Model',
          'Dual Nature of Electromagnetic Radiation',
          'Wave Nature of Light',
          'Electromagnetic Spectrum',
          'Plancks Quantum Theory',
          'Quantization of Energy E=hv',
          'Black Body Radiation',
          'Photoelectric Effect',
          'Threshold Frequency and Work Function',
          'Atomic Spectra Line Spectrum of Hydrogen'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Bohr’s Model for Hydrogen Atom',
        url: 'https://youtu.be/au2HCVn9IJI',
        videoId: 'au2HCVn9IJI',
        keywords: [
          'Bohrs Model for Hydrogen Atom',
          'Postulates of Bohr Model',
          'Quantization of Angular Momentum mvr=nh/2pi',
          'Stationary Orbits',
          'Energy of Orbits in Hydrogen',
          'Radius of Bohr Orbit r=0.529n^2/Z',
          'Rydberg Formula for Hydrogen Spectrum',
          'Spectral Series Lyman Balmer Paschen Brackett Pfund',
          'Limitations of Bohr Model'
        ]
      },
      {
        id: '2-5',
        code: '2.5',
        title: 'Towards Quantum Mechanical Model of Atom',
        url: 'https://youtu.be/-4-TJMhGlX8',
        videoId: '-4-TJMhGlX8',
        keywords: [
          'Towards Quantum Mechanical Model',
          'Dual Behavior of Matter',
          'De Broglie Relationship lambda=h/mv',
          'Matter Waves',
          'De Broglie Wavelength',
          'Heisenbergs Uncertainty Principle delta x delta p >= h/4pi',
          'Significance of Uncertainty Principle',
          'Wave Particle Duality'
        ]
      },
      {
        id: '2-6',
        code: '2.6',
        title: 'Quantum Mechanical Model of Atom',
        url: 'https://youtu.be/-4-TJMhGlX8',
        videoId: '-4-TJMhGlX8',
        keywords: [
          'Quantum Mechanical Model of Atom',
          'Schrodinger Wave Equation',
          'Wavefunction Psi and Probability Density Psi Square',
          'Atomic Orbitals Concept',
          'Quantum Numbers',
          'Principal Quantum Number n',
          'Azimuthal Angular Momentum Quantum Number l',
          'Magnetic Quantum Number m',
          'Spin Quantum Number s',
          'Shapes of s p d Orbitals',
          'Nodes and Nodal Planes',
          'Aufbau Principle n+l Rule',
          'Pauli Exclusion Principle',
          'Hunds Rule of Maximum Multiplicity',
          'Electronic Configuration of Atoms'
        ]
      }
    ]
  },
  {
    id: 'classification-elements',
    number: '3',
    name: 'Classification of Elements & Periodicity',
    description: 'Genesis of periodic classification, Modern periodic law, Mendeleev table, s/p/d/f block elements, and periodic trends in atomic radius, IE, EA & electronegativity.',
    color: 'from-cyan-600 to-sky-600',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Why Do We Need to Classify Elements?',
        url: 'https://youtu.be/DCfiIWe2jtQ',
        videoId: 'DCfiIWe2jtQ',
        keywords: [
          'Why Do We Need to Classify Elements',
          'Need for Classification',
          'Historical Perspective of Elements',
          'Systematic Study of Chemistry',
          'Organization of Chemical Elements'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Genesis of Periodic Classification',
        url: 'https://youtu.be/ogpWoB4m-Ns',
        videoId: 'ogpWoB4m-Ns',
        keywords: [
          'Genesis of Periodic Classification',
          'Dobereiner Triads',
          'Newlands Law of Octaves',
          'Lothar Meyer Atomic Volume Curves',
          'Mendeleev Periodic Table',
          'Mendeleev Periodic Law',
          'Merits and Achievements of Mendeleev Table',
          'Anomalies of Mendeleev Periodic Table'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'Modern Periodic Law and Present Form of Periodic Table',
        url: 'https://youtu.be/j4DxfdNCIi8',
        videoId: 'j4DxfdNCIi8',
        keywords: [
          'Modern Periodic Law',
          'Moseley Experiment X-ray Frequency',
          'Atomic Number as Fundamental Property',
          'Modern Periodic Table Structure',
          'Long Form of Periodic Table',
          'Periods and Groups in Periodic Table',
          'Main Group Elements and Transition Metals'
        ]
      },
      {
        id: '3-4',
        code: '3.4',
        title: 'Nomenclature of Elements with Atomic Numbers > 100',
        url: 'https://youtu.be/kaYyhcTKmbI',
        videoId: 'kaYyhcTKmbI',
        keywords: [
          'Nomenclature of Elements with Atomic Numbers Greater Than 100',
          'IUPAC Systematic Naming of Elements',
          'Numerical Roots nil un bi tri quad pent hex sept oct enn',
          'Unnilunium Unnilquadium Naming',
          'Superheavy Elements IUPAC Naming'
        ]
      },
      {
        id: '3-5',
        code: '3.5',
        title: 'Electronic Configurations and the Periodic Table',
        url: 'https://youtu.be/hwqLCwgo6SU',
        videoId: 'hwqLCwgo6SU',
        keywords: [
          'Electronic Configurations of Elements and Periodic Table',
          'Period Wise Electronic Configuration',
          'Group Wise Electronic Configuration',
          'Valence Shell Electrons',
          'Core Electrons and Shielding',
          'Representative Elements Configurations'
        ]
      },
      {
        id: '3-6',
        code: '3.6',
        title: 'Electronic Configurations and Types of Elements: s, p, d, f Blocks',
        url: 'https://youtu.be/ySJiL64jsfo',
        videoId: 'ySJiL64jsfo',
        keywords: [
          'Types of Elements s p d f Blocks',
          's-Block Elements Alkali and Alkaline Earth Metals',
          'p-Block Elements Chalcogens Halogens Noble Gases',
          'd-Block Elements Transition Elements',
          'f-Block Elements Inner Transition Lanthanoids Actinoids',
          'Classification as Metals Non-Metals and Metalloids',
          'General Electronic Configuration of Blocks'
        ]
      },
      {
        id: '3-7',
        code: '3.7',
        title: 'Periodic Trends in Properties of Elements',
        url: 'https://youtu.be/2HZZXonSIRo',
        videoId: '2HZZXonSIRo',
        keywords: [
          'Periodic Trends in Properties',
          'Atomic Radius and Ionic Radius',
          'Covalent Radius and Van der Waals Radius',
          'Isoelectronic Ions Size Comparison',
          'Ionization Enthalpy IE1 IE2 IE3',
          'Factors Affecting Ionization Enthalpy',
          'Electron Gain Enthalpy',
          'Electronegativity Pauling Scale',
          'Valence and Oxidation States',
          'Anomalous Properties of Second Period Elements',
          'Diagonal Relationship Li-Mg Be-Al'
        ]
      }
    ]
  },
  {
    id: 'chemical-bonding',
    number: '4',
    name: 'Chemical Bonding & Molecular Structure',
    description: 'Kossel-Lewis octet rule, ionic bonds, bond parameters, VSEPR 3D geometries, valence bond theory, hybridization (sp to sp3d2), MOT diagrams, and hydrogen bonding.',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Kossel-Lewis Approach to Chemical Bonding',
        url: 'https://youtu.be/t3ck7euKYu8',
        videoId: 't3ck7euKYu8',
        keywords: [
          'Kossel-Lewis Approach',
          'Octet Rule',
          'Lewis Dot Symbols',
          'Lewis Representation of Molecules',
          'Formal Charge Calculation',
          'Limitations of Octet Rule',
          'Incomplete Octet BF3 BeCl2',
          'Odd Electron Molecules NO NO2',
          'Expanded Octet PCl5 SF6 H2SO4'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'Ionic or Electrovalent Bond',
        url: 'https://youtu.be/SEcpBDhnq78',
        videoId: 'SEcpBDhnq78',
        keywords: [
          'Ionic Bond',
          'Electrovalent Bond',
          'Formation of Ionic Compounds',
          'Lattice Enthalpy',
          'Born-Haber Cycle for NaCl',
          'Factors Favouring Ionic Bond Formation',
          'Low Ionization Enthalpy High Electron Gain Enthalpy',
          'General Characteristics of Ionic Compounds'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'Bond Parameters',
        url: 'https://youtu.be/sHSCHZVJ_H4',
        videoId: 'sHSCHZVJ_H4',
        keywords: [
          'Bond Parameters',
          'Bond Length',
          'Bond Angle',
          'Bond Enthalpy Dissociation Energy',
          'Bond Order Concept',
          'Resonance Structures and Resonance Energy',
          'Polarity of Bonds',
          'Dipole Moment Debye Units',
          'Covalent Character in Ionic Bonds',
          'Fajans Rules Polarization and Polarizability'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'Valence Shell Electron Pair Repulsion (VSEPR) Theory',
        url: 'https://youtu.be/v5OzQl860tA',
        videoId: 'v5OzQl860tA',
        keywords: [
          'VSEPR Theory',
          'Valence Shell Electron Pair Repulsion',
          'Repulsion Order Lone Pair Lone Pair vs Bond Pair',
          'Geometry and Shapes of Molecules',
          'Linear BeCl2',
          'Trigonal Planar BF3',
          'Tetrahedral CH4',
          'Trigonal Pyramidal NH3',
          'Bent V-Shape H2O',
          'Trigonal Bipyramidal PCl5',
          'Octahedral SF6',
          'See-saw SF4 T-shape ClF3 Square Planar XeF4'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'Valence Bond Theory (VBT)',
        url: 'https://youtu.be/Vqx9a2aU99c',
        videoId: 'Vqx9a2aU99c',
        keywords: [
          'Valence Bond Theory',
          'VBT Postulates',
          'Orbital Overlap Concept',
          'Sigma Bond Axial Overlap',
          'Pi Bond Lateral Sideways Overlap',
          'Types of Overlapping s-s s-p p-p',
          'Strength of Sigma Bond vs Pi Bond',
          'Potential Energy Diagram of H2 Formation'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'Hybridisation',
        url: 'https://youtu.be/J8GLj_armbA',
        videoId: 'J8GLj_armbA',
        keywords: [
          'Hybridisation',
          'Types of Hybridisation',
          'sp Hybridisation BeCl2 C2H2',
          'sp2 Hybridisation BF3 C2H4',
          'sp3 Hybridisation CH4 NH3 H2O',
          'sp3d Hybridisation PCl5 Axial vs Equatorial Bonds',
          'sp3d2 Hybridisation SF6',
          'Hybrid Orbitals Characteristics',
          'Percentage s and p Character in Hybrid Orbitals'
        ]
      },
      {
        id: '4-7',
        code: '4.7',
        title: 'Molecular Orbital Theory (MOT)',
        url: 'https://youtu.be/JjidYZYb_ck',
        videoId: 'JjidYZYb_ck',
        keywords: [
          'Molecular Orbital Theory',
          'MOT Postulates',
          'LCAO Method Linear Combination of Atomic Orbitals',
          'Bonding Molecular Orbitals sigma pi',
          'Antibonding Molecular Orbitals sigma* pi*',
          'Conditions for Combination of Atomic Orbitals',
          'Energy Level Diagram of Molecular Orbitals',
          'Electronic Configuration of Diatomic Molecules'
        ]
      },
      {
        id: '4-8',
        code: '4.8',
        title: 'Bonding in Homonuclear Diatomic Molecules',
        url: 'https://youtu.be/4RqzQAZOcbk',
        videoId: '4RqzQAZOcbk',
        keywords: [
          'Homonuclear Diatomic Molecules',
          'MOT Configurations',
          'Bond Order Formula Nb-Na/2',
          'Hydrogen Molecule H2 Bond Order',
          'Helium Molecule He2 Stability',
          'Lithium Li2 Carbon C2 Nitrogen N2 Molecule',
          'Oxygen Molecule O2 Paramagnetic Nature',
          'Fluorine F2 Molecule',
          'Magnetic Character Diamagnetic vs Paramagnetic'
        ]
      },
      {
        id: '4-9',
        code: '4.9',
        title: 'Hydrogen Bonding',
        url: 'https://youtu.be/ltxqQbiI6-o',
        videoId: 'ltxqQbiI6-o',
        keywords: [
          'Hydrogen Bonding',
          'Cause of Hydrogen Bond Formation',
          'Intermolecular Hydrogen Bonding H2O HF NH3',
          'Intramolecular Hydrogen Bonding o-Nitrophenol',
          'Effects of Hydrogen Bonding',
          'High Boiling Point of Water and Alcohols',
          'Unusual Density of Ice vs Water Structure',
          'Solubility and Viscosity Influences'
        ]
      }
    ]
  },
  {
    id: 'thermodynamics',
    number: '5',
    name: 'Thermodynamics',
    description: 'Thermodynamic systems, state functions, first law, calorimetry, reaction enthalpy, Hess’s law, spontaneity, entropy, and Gibbs free energy equilibrium.',
    color: 'from-amber-600 to-rose-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '5-1',
        code: '5.1',
        title: 'Thermodynamic Terms',
        url: 'https://youtu.be/ltxqQbiI6-o',
        videoId: 'ltxqQbiI6-o',
        keywords: [
          'Thermodynamic Terms',
          'System and Surroundings',
          'Open System Closed System Isolated System',
          'State of System and State Functions',
          'Path Functions Work and Heat',
          'Intensive and Extensive Properties',
          'Internal Energy U Change Delta U',
          'First Law of Thermodynamics Delta U = q + w',
          'Sign Conventions for Work and Heat'
        ]
      },
      {
        id: '5-2',
        code: '5.2',
        title: 'Applications of Thermodynamics',
        url: 'https://youtu.be/0a8gjbn33rM',
        videoId: '0a8gjbn33rM',
        keywords: [
          'Applications of Thermodynamics',
          'Work of Expansion PV Work',
          'Reversible and Irreversible Processes',
          'Isothermal Reversible Expansion Work Formula',
          'w = -2.303 nRT log(V2/V1)',
          'Adiabatic Process',
          'Free Expansion of Ideal Gas',
          'Enthalpy Definition H = U + pV',
          'Relation Between Delta H and Delta U'
        ]
      },
      {
        id: '5-3',
        code: '5.3',
        title: 'Measurement of ∆U and ∆H: Calorimetry',
        url: 'https://youtu.be/HsfesYq5B_A',
        videoId: 'HsfesYq5B_A',
        keywords: [
          'Measurement of Delta U and Delta H',
          'Calorimetry Principles',
          'Bomb Calorimeter at Constant Volume qv',
          'Calorimeter at Constant Pressure qp',
          'Heat Capacity C',
          'Specific Heat Capacity s',
          'Molar Heat Capacity Cm',
          'Relation Between Cp and Cv for Ideal Gas Cp - Cv = R'
        ]
      },
      {
        id: '5-4',
        code: '5.4',
        title: 'Enthalpy Change, ∆H of a Reaction',
        url: 'https://youtu.be/VwA3qHK6eS0',
        videoId: 'VwA3qHK6eS0',
        keywords: [
          'Enthalpy Change of Reaction',
          'Reaction Enthalpy Delta r H',
          'Standard Enthalpy of Reactions',
          'Exothermic and Endothermic Reactions',
          'Standard Enthalpy of Formation Delta f H',
          'Reference State of Elements Zero Enthalpy',
          'Standard Enthalpy of Combustion',
          'Hess Law of Constant Heat Summation',
          'Thermochemical Equations and Numerical Problems'
        ]
      },
      {
        id: '5-5',
        code: '5.5',
        title: 'Enthalpies for Different Types of Reactions',
        url: 'https://youtu.be/Ect5tj2ed3g',
        videoId: 'Ect5tj2ed3g',
        keywords: [
          'Enthalpies for Different Types of Reactions',
          'Bond Dissociation Enthalpy',
          'Mean Bond Enthalpy Calculation of Delta H',
          'Enthalpy of Atomization',
          'Enthalpy of Sublimation Vaporization Fusion',
          'Enthalpy of Ionization and Electron Gain',
          'Enthalpy of Solution and Hydration',
          'Lattice Enthalpy Born-Haber Cycle Connection'
        ]
      },
      {
        id: '5-6',
        code: '5.6',
        title: 'Spontaneity',
        url: 'https://youtu.be/_eM-IYEd4bc',
        videoId: '_eM-IYEd4bc',
        keywords: [
          'Spontaneity in Thermodynamics',
          'Spontaneous and Non-Spontaneous Processes',
          'Driving Force for Spontaneous Process',
          'Decrease in Enthalpy Limitation',
          'Entropy S Measure of Randomness',
          'Second Law of Thermodynamics',
          'Entropy Change Delta S = qrev/T',
          'Total Entropy Change of Universe',
          'Entropy of Phase Transformations'
        ]
      },
      {
        id: '5-7',
        code: '5.7',
        title: 'Gibbs Energy Change and Equilibrium',
        url: 'https://youtu.be/2OQT2-8yWGA',
        videoId: '2OQT2-8yWGA',
        keywords: [
          'Gibbs Energy Change and Equilibrium',
          'Gibbs Free Energy G = H - TS',
          'Gibbs Helmholtz Equation Delta G = Delta H - T Delta S',
          'Criteria for Spontaneity Delta G Negative',
          'Effect of Temperature on Spontaneity',
          'Standard Gibbs Energy Change Delta G Zero',
          'Relation Between Delta G and Equilibrium Constant K',
          'Delta r G0 = -2.303 RT log K',
          'Third Law of Thermodynamics Absolute Entropy'
        ]
      }
    ]
  }
];

// Helper to normalize strings for resilient search (lowercased, alphanumeric only)
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

export default function ChemistryCurriculum({ onEnroll }) {
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

      // If user has a specific tab selected and results exist within that tab, prioritize
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
    <section id="chemistry-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-4 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs">
            <Tv size={15} />
            <span>AP & TS Intermediate Chemistry Video Lectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Chemistry Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore topic-by-topic concept explanations, atomic models, periodic trends, VSEPR & MOT chemical bonding, and thermodynamics numericals with high-yield video solutions.
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
                  These are sample demo videos. <strong>Enroll now</strong> to get full access to detailed all chapters, organic reaction flowcharts, formula sheets, and live 1-on-1 faculty doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Chemistry Full Course - All Chapters Access')}
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
              placeholder="Search topic or keyword (e.g. Mole Concept, VSEPR, Bohr, Calorimetry...)"
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
              Try searching with general keywords like <strong>Stoichiometry</strong>, <strong>Bohr Model</strong>, <strong>Hybridisation</strong>, <strong>VSEPR</strong>, or <strong>Thermodynamics</strong>.
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
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop';
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
                        <FlaskConical size={12} className="shrink-0" />
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

        {/* Bottom Doubt Clearing & Live Tuition CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 border border-emerald-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Live 1-on-1 Faculty Assistance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Personal Mentorship or Have Doubts in These Chemistry Topics?
              </h3>
              <p className="text-emerald-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, reaction mechanism breakdown, board presentation tips, and step-by-step numerical solving to score a guaranteed 60/60 in Chemistry.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Chemistry 1-on-1 Live Doubt & Board Coaching')}
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
                  if (onEnroll) onEnroll(`Chemistry Help: Topic ${current.code} - ${current.title}`);
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
