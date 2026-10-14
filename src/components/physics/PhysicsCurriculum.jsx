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
  Zap,
  Atom
} from 'lucide-react';

const TOPICS_DATA = [
  {
    id: 'physical-world-measurement',
    number: '1',
    name: 'Physical World & Measurement',
    description: 'Fundamental forces, SI units, dimensional formulae, error analysis, significant figures, and dimensional applications.',
    color: 'from-blue-600 to-cyan-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '1-1',
        code: '1.1',
        title: 'What Is Physics?',
        url: 'https://youtu.be/9McW3Sa4zqI?si=7ASLgLs_8uiz9nTA',
        videoId: '9McW3Sa4zqI',
        keywords: [
          'What Is Physics?',
          'What Is Physics? explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-2',
        code: '1.2',
        title: 'Scope and Excitement of Physics',
        url: 'https://youtu.be/UPlhFNrdZ68?si=7hWMhTfLVNlKmMOP',
        videoId: 'UPlhFNrdZ68',
        keywords: [
          'Scope and Excitement of Physics',
          'Scope and Excitement of Physics explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-3',
        code: '1.3',
        title: 'Physics, Technology and Society',
        url: 'https://youtu.be/_KVaDMgXKVU?si=q2iaj8uufgZRqn_G',
        videoId: '_KVaDMgXKVU',
        keywords: [
          'Physics, Technology and Society',
          'Physics, Technology and Society explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-4',
        code: '1.4',
        title: 'Fundamental Forces in Nature',
        url: 'https://youtu.be/aVNVwEZrL_g?si=9cwt_8-isDkqsskJ',
        videoId: 'aVNVwEZrL_g',
        keywords: [
          'Fundamental Forces in Nature',
          'Fundamental Forces in Nature explanation',
          'gravitational electromagnetic strong weak nuclear forces',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-5',
        code: '1.5',
        title: 'Nature of Physical Laws',
        url: 'https://youtu.be/zRE4BckETds?si=Cr8_FVyOEQjT6APc',
        videoId: 'zRE4BckETds',
        keywords: [
          'Nature of Physical Laws',
          'Nature of Physical Laws explanation',
          'conservation laws',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-6',
        code: '1.6',
        title: 'The International System of Units (SI)',
        url: 'https://youtu.be/8rZRYPoerPw?si=Hnr2m0WP73GzhCwU',
        videoId: '8rZRYPoerPw',
        keywords: [
          'The International System of Units (SI)',
          'SI units',
          'fundamental and derived units',
          'The International System of Units (SI) explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-7',
        code: '1.7',
        title: 'Measurement of Length, Mass and Time',
        url: 'https://youtu.be/7IbDcz5aczU?si=yldkaZTwe73Wre_v',
        videoId: '7IbDcz5aczU',
        keywords: [
          'Measurement of Length, Mass and Time',
          'Measurement of Length, Mass and Time explanation',
          'parallax method',
          'atomic clock',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-8',
        code: '1.8',
        title: 'Accuracy, Precision and Errors in Measurement',
        url: 'https://youtu.be/AympZ7Zorkk?si=T3S2DHt_u3klw1xG',
        videoId: 'AympZ7Zorkk',
        keywords: [
          'Accuracy, Precision and Errors in Measurement',
          'systematic and random errors',
          'percentage error',
          'Accuracy, Precision and Errors in Measurement explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-9',
        code: '1.9',
        title: 'Significant Figures',
        url: 'https://youtu.be/qNnYyne2Tgs?si=Js9WCfsBFKjpMN3_',
        videoId: 'qNnYyne2Tgs',
        keywords: [
          'Significant Figures',
          'rules for significant figures',
          'rounding off',
          'Significant Figures explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-10',
        code: '1.10',
        title: 'Dimensions of Physical Quantities',
        url: 'https://youtu.be/bNaRUh8T_wQ?si=F0ilFdfGI-fIDdK_',
        videoId: 'bNaRUh8T_wQ',
        keywords: [
          'Dimensions of Physical Quantities',
          'Dimensions of Physical Quantities explanation',
          'dimensional constants',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-11',
        code: '1.11',
        title: 'Dimensional Formulae and Equations',
        url: 'https://youtu.be/bNaRUh8T_wQ?si=uJa9i214tJWp-XPm',
        videoId: 'bNaRUh8T_wQ',
        keywords: [
          'Dimensional Formulae and Dimensional Equations',
          'Dimensional Formulae',
          'Dimensional Equations',
          'Dimensional Formulae and Dimensional Equations explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '1-12',
        code: '1.12',
        title: 'Dimensional Analysis and Its Applications',
        url: 'https://youtu.be/c2KhOBz3y7s?si=onrf2Tc33zhzFDHz',
        videoId: 'c2KhOBz3y7s',
        keywords: [
          'Dimensional Analysis and Its Applications',
          'principle of homogeneity',
          'conversion of units',
          'deducing relations',
          'Dimensional Analysis and Its Applications explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'straight-line-motion',
    number: '2',
    name: 'Motion Along A Straight Line',
    description: 'Displacement, average and instantaneous speed/velocity, kinematics graphs, equations of motion, and relative velocity.',
    color: 'from-cyan-600 to-teal-600',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    videos: [
      {
        id: '2-1',
        code: '2.1',
        title: 'Introduction to Motion',
        url: 'https://youtu.be/elAzkXyRQFU?si=5I5uOYjQ4uMRLZVw',
        videoId: 'elAzkXyRQFU',
        keywords: [
          'Introduction to Motion',
          'Introduction to Motion explanation',
          'frame of reference',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-2',
        code: '2.2',
        title: 'Position, Path Length and Displacement',
        url: 'https://youtu.be/vc0FWz6E7gM?si=nlTgyY85ah0FSj80',
        videoId: 'vc0FWz6E7gM',
        keywords: [
          'Position, Path Length and Displacement',
          'Position, Path Length and Displacement explanation',
          'distance vs displacement',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-3',
        code: '2.3',
        title: 'Average Velocity and Average Speed',
        url: 'https://youtu.be/EfLLkGjBKog?si=cbAe5GyG-knr5Yno',
        videoId: 'EfLLkGjBKog',
        keywords: [
          'Average Velocity and Average Speed',
          'Average Velocity and Average Speed explanation',
          'average speed formulas',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-4',
        code: '2.4',
        title: 'Instantaneous Velocity and Speed',
        url: 'https://youtu.be/pfTTHx9kCHk?si=rphQ-u2u7vlNmSH_',
        videoId: 'pfTTHx9kCHk',
        keywords: [
          'Instantaneous Velocity and Speed',
          'Instantaneous Velocity and Speed explanation',
          'calculus in kinematics dx/dt',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-5',
        code: '2.5',
        title: 'Acceleration',
        url: 'https://youtu.be/vxFYfumAAlY?si=vn9qjbkScQtK170T',
        videoId: 'vxFYfumAAlY',
        keywords: [
          'Acceleration',
          'Acceleration explanation',
          'uniform and non-uniform acceleration',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-6',
        code: '2.6',
        title: 'Position-Time Graphs',
        url: 'https://youtu.be/tjt04Eqiw8s?si=XN7uueq4wj762SYI',
        videoId: 'tjt04Eqiw8s',
        keywords: [
          'Position-Time Graphs',
          'x-t graph slope velocity',
          'Position-Time Graphs explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-7',
        code: '2.7',
        title: 'Velocity-Time & Acceleration-Time Graphs',
        url: 'https://youtu.be/AJF2n5RWXKE?si=ZuTTJfbR2TZzOoyY',
        videoId: 'AJF2n5RWXKE',
        keywords: [
          'Velocity-Time and Acceleration-Time Graphs',
          'v-t graph area displacement',
          'a-t graph',
          'Velocity-Time and Acceleration-Time Graphs explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-8',
        code: '2.8',
        title: 'Equations of Motion (Uniform Acceleration)',
        url: 'https://youtu.be/VL_fgjsSC8M?si=aqfBGYZ3HpxER11m',
        videoId: 'VL_fgjsSC8M',
        keywords: [
          'Equations of Motion for Uniformly Accelerated Motion',
          'kinematic equations v=u+at s=ut+1/2at^2',
          'Equations of Motion for Uniformly Accelerated Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '2-9',
        code: '2.9',
        title: 'Relative Velocity',
        url: 'https://youtu.be/O7q75-8nGos?si=9v31x_RSLfntPoBP',
        videoId: 'O7q75-8nGos',
        keywords: [
          'Relative Velocity',
          'Relative Velocity in 1D',
          'Relative Velocity explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'plane-motion',
    number: '3',
    name: 'Motion In A Plane',
    description: 'Vectors, analytical resolution, 2D relative velocity, projectile motion trajectory, range, maximum height, and circular kinematics.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '3-1',
        code: '3.1',
        title: 'Introduction to 2D Motion',
        url: 'https://youtu.be/PGAd2koXEFE?si=8Vk6LEzFlNZqHh_S',
        videoId: 'PGAd2koXEFE',
        keywords: [
          'Introduction',
          'Motion in a plane intro',
          'Introduction explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-2',
        code: '3.2',
        title: 'Scalars and Vectors',
        url: 'https://youtu.be/We4QOHZEy9w?si=oc1_KeW0zFrm4eoq',
        videoId: 'We4QOHZEy9w',
        keywords: [
          'Scalars and Vectors',
          'Scalars and Vectors explanation',
          'vector representation unit vectors',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-3',
        code: '3.3',
        title: 'Multiplication of Vectors by Real Numbers',
        url: 'https://youtu.be/mMJcxUl-ISw?si=mH2HIBEtdMIbgcce',
        videoId: 'mMJcxUl-ISw',
        keywords: [
          'Multiplication of Vectors by Real Numbers',
          'Multiplication of Vectors by Real Numbers explanation',
          'scalar multiplication',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-4',
        code: '3.4',
        title: 'Addition and Subtraction of Vectors',
        url: 'https://youtu.be/VFRW0f0XUU8?si=j6v8RaofAbTSo0tN',
        videoId: 'VFRW0f0XUU8',
        keywords: [
          'Addition and Subtraction of Vectors',
          'triangle law parallelogram law',
          'Addition and Subtraction of Vectors explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-5',
        code: '3.5',
        title: 'Resolution of Vectors',
        url: 'https://youtu.be/K_CEjh4rD5A?si=mweL0EMGLX6OGVtd',
        videoId: 'K_CEjh4rD5A',
        keywords: [
          'Resolution of Vectors',
          'rectangular components cos sin',
          'Resolution of Vectors explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-6',
        code: '3.6',
        title: 'Vector Addition – Analytical Method',
        url: 'https://youtu.be/ZM2-Bb8Zdt0?si=NnEOXaSn82zRMedx',
        videoId: 'ZM2-Bb8Zdt0',
        keywords: [
          'Vector Addition – Analytical Method',
          'resultant magnitude and direction',
          'Vector Addition – Analytical Method explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-7',
        code: '3.7',
        title: 'Motion in a Plane – Velocity & Acceleration',
        url: 'https://youtu.be/PGAd2koXEFE?si=-j0sN0r2ae6gr6YC',
        videoId: 'PGAd2koXEFE',
        keywords: [
          'Motion in a Plane',
          '2D position velocity acceleration',
          'Motion in a Plane explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-8',
        code: '3.8',
        title: 'Motion with Constant Acceleration in 2D',
        url: 'https://youtu.be/I-w7x-CCi-c?si=WoL-ioZXqJjUszAc',
        videoId: 'I-w7x-CCi-c',
        keywords: [
          'Motion with Constant Acceleration',
          '2D kinematics equations',
          'Motion with Constant Acceleration explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-9',
        code: '3.9',
        title: 'Relative Velocity in Two Dimensions',
        url: 'https://youtu.be/_39hCnqbNXM?si=hq1M438KU82Ie2_f',
        videoId: '_39hCnqbNXM',
        keywords: [
          'Relative Velocity in Two Dimensions',
          'rain-umbrella river-boat problems',
          'Relative Velocity in Two Dimensions explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-10',
        code: '3.10',
        title: 'Projectile Motion',
        url: 'https://youtu.be/Rp_LtVvy2LY?si=vqGS2hZwSFzp0Td_',
        videoId: 'Rp_LtVvy2LY',
        keywords: [
          'Projectile Motion',
          'trajectory parabola time of flight maximum height horizontal range',
          'Projectile Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '3-11',
        code: '3.11',
        title: 'Uniform Circular Motion',
        url: 'https://youtu.be/TyxJVLqOMvc?si=4wkp4njmUfEk1wCW',
        videoId: 'TyxJVLqOMvc',
        keywords: [
          'Uniform Circular Motion',
          'centripetal acceleration v^2/r angular speed',
          'Uniform Circular Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'laws-of-motion',
    number: '4',
    name: 'Laws Of Motion',
    description: 'Newton’s three laws, law of inertia, momentum conservation, equilibrium, free body diagrams, friction, and banked tracks.',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    videos: [
      {
        id: '4-1',
        code: '4.1',
        title: 'Introduction to Dynamics',
        url: 'https://youtu.be/MaabUHLIIXA?si=xPPPqr9mW11Pm-yv',
        videoId: 'MaabUHLIIXA',
        keywords: [
          'Introduction',
          'Laws of motion intro',
          'Introduction explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-2',
        code: '4.2',
        title: 'Aristotle’s Fallacy',
        url: 'https://youtu.be/XFbCwO7fmYo?si=lnF-6D_F0Ns4__39',
        videoId: 'XFbCwO7fmYo',
        keywords: [
          'Aristotle’s Fallacy',
          'Galileo experiments on motion',
          'Aristotle’s Fallacy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-3',
        code: '4.3',
        title: 'The Law of Inertia',
        url: 'https://youtu.be/U80_NmZZml0?si=D8HFgGWFgE4Y3iyI',
        videoId: 'U80_NmZZml0',
        keywords: [
          'The Law of Inertia',
          'inertia of rest motion direction',
          'The Law of Inertia explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-4',
        code: '4.4',
        title: 'Newton’s First Law of Motion',
        url: 'https://youtu.be/1XSyyjcEHo0?si=W4FOub8C82lS0Qwn',
        videoId: '1XSyyjcEHo0',
        keywords: [
          'Newton’s First Law of Motion',
          'definition of force and inertia',
          'Newton’s First Law of Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-5',
        code: '4.5',
        title: 'Newton’s Second Law of Motion',
        url: 'https://youtu.be/EwGGh1dC3kQ?si=krUeHKKbqPqqTxD8',
        videoId: 'EwGGh1dC3kQ',
        keywords: [
          'Newton’s Second Law of Motion',
          'F=ma rate of change of momentum impulse',
          'Newton’s Second Law of Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-6',
        code: '4.6',
        title: 'Newton’s Third Law of Motion',
        url: 'https://youtu.be/y61_VPKH2B4?si=UVrWnQpmmwfVfZ8p',
        videoId: 'y61_VPKH2B4',
        keywords: [
          'Newton’s Third Law of Motion',
          'action and reaction forces',
          'Newton’s Third Law of Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-7',
        code: '4.7',
        title: 'Conservation of Momentum',
        url: 'https://youtu.be/PJMFxBIqkSs?si=DbU6QKeZyL7arM1r',
        videoId: 'PJMFxBIqkSs',
        keywords: [
          'Conservation of Momentum',
          'law of conservation of linear momentum recoil of gun',
          'Conservation of Momentum explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-8',
        code: '4.8',
        title: 'Equilibrium of a Particle',
        url: 'https://youtu.be/ESq2oJpPmiU?si=ILKbAs9wxWJ5FvvF',
        videoId: 'ESq2oJpPmiU',
        keywords: [
          'Equilibrium of a Particle',
          'concurrent forces Lami theorem',
          'Equilibrium of a Particle explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-9',
        code: '4.9',
        title: 'Common Forces in Mechanics',
        url: 'https://youtu.be/W7w-fypziI4?si=XkzRjDd-nCCHlVIs',
        videoId: 'W7w-fypziI4',
        keywords: [
          'Common Forces in Mechanics',
          'normal reaction tension spring force',
          'Common Forces in Mechanics explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-10',
        code: '4.10',
        title: 'Friction – Static, Kinetic & Rolling',
        url: 'https://youtu.be/nRSV1Y4XlhU?si=kLxYkrWim_MxycZg',
        videoId: 'nRSV1Y4XlhU',
        keywords: [
          'Friction',
          'laws of friction coefficient of friction angle of repose',
          'Friction explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-11',
        code: '4.11',
        title: 'Circular Motion & Banking of Roads',
        url: 'https://youtu.be/lV3h2kpJzp8?si=5g5KJ7FXI9xosNMM',
        videoId: 'lV3h2kpJzp8',
        keywords: [
          'Circular Motion',
          'centripetal force banked roads bending of cyclist',
          'Circular Motion explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '4-12',
        code: '4.12',
        title: 'Solving Problems in Mechanics (FBDs)',
        url: 'https://youtu.be/bIPHKyZIvxk?si=wwiMv3abiwodEG91',
        videoId: 'bIPHKyZIvxk',
        keywords: [
          'Solving Problems in Mechanics',
          'free body diagrams pulley systems connected bodies',
          'Solving Problems in Mechanics explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'work-energy-power',
    number: '5',
    name: 'Work, Energy And Power',
    description: 'Work-energy theorem, variable forces, potential energy of springs, mechanical energy conservation, and elastic collisions.',
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    videos: [
      {
        id: '5-1',
        code: '5.1',
        title: 'Introduction to Work & Energy',
        url: 'https://youtu.be/w4QFJb9a8vo?si=72mEHlEEh7fpYuMY',
        videoId: 'w4QFJb9a8vo',
        keywords: [
          'Introduction',
          'Work, Energy and Power intro',
          'Introduction explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-2',
        code: '5.2',
        title: 'Work and Scalar Product',
        url: 'https://youtu.be/ceGUvsq_NHo?si=oK0DYYhuFnw_nA92',
        videoId: 'ceGUvsq_NHo',
        keywords: [
          'Work',
          'W=F.d dot product work by constant force',
          'Work explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-3',
        code: '5.3',
        title: 'Kinetic Energy',
        url: 'https://youtu.be/J0WPu3FeEZQ?si=Eflm1itHWQw4tlQH',
        videoId: 'J0WPu3FeEZQ',
        keywords: [
          'Kinetic Energy',
          'KE=1/2mv^2 relation with momentum',
          'Kinetic Energy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-4',
        code: '5.4',
        title: 'Work-Energy Theorem',
        url: 'https://youtu.be/nnMirzeTepQ?si=ElwooX0cS5XR1_kP',
        videoId: 'nnMirzeTepQ',
        keywords: [
          'Work-Energy Theorem',
          'W_net=delta KE proof derivation',
          'Work-Energy Theorem explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-5',
        code: '5.5',
        title: 'Work Done by a Variable Force',
        url: 'https://youtu.be/PCsbCvK1HoQ?si=6A7L6itCkKxHscjZ',
        videoId: 'PCsbCvK1HoQ',
        keywords: [
          'Work Done by a Variable Force',
          'integral F dx force-displacement graph area',
          'Work Done by a Variable Force explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-6',
        code: '5.6',
        title: 'Potential Energy',
        url: 'https://youtu.be/aUrms3VFn0I?si=sTpyDrkoYYyS1ekt',
        videoId: 'aUrms3VFn0I',
        keywords: [
          'Potential Energy',
          'gravitational potential energy conservative forces',
          'Potential Energy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-7',
        code: '5.7',
        title: 'Conservation of Mechanical Energy',
        url: 'https://youtu.be/BOxcFUpbydA?si=K7EPgmRjHUb4PGhX',
        videoId: 'BOxcFUpbydA',
        keywords: [
          'Conservation of Mechanical Energy',
          'freely falling body total energy constant',
          'Conservation of Mechanical Energy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-8',
        code: '5.8',
        title: 'Potential Energy of a Spring',
        url: 'https://youtu.be/k80MEgKC0RI?si=3f6NqI_qcgGsBOCX',
        videoId: 'k80MEgKC0RI',
        keywords: [
          'Potential Energy of a Spring',
          'Hooke law spring constant 1/2kx^2',
          'Potential Energy of a Spring explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-9',
        code: '5.9',
        title: 'Various Forms of Energy',
        url: 'https://youtu.be/E3MnZ-bj1Iw?si=stKkLZxSpXdH0nIb',
        videoId: 'E3MnZ-bj1Iw',
        keywords: [
          'Various Forms of Energy',
          'heat chemical nuclear electrical energy',
          'Various Forms of Energy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-10',
        code: '5.10',
        title: 'Law of Conservation of Energy',
        url: 'https://youtu.be/pF0J86NTiSs?si=qPWXr19gYWhvEnDI',
        videoId: 'pF0J86NTiSs',
        keywords: [
          'Law of Conservation of Energy',
          'energy transformation and conservation',
          'Law of Conservation of Energy explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-11',
        code: '5.11',
        title: 'Power and Efficiency',
        url: 'https://youtu.be/RpbxIG5HTf4?si=U9gBlVwbQCzSmcHu',
        videoId: 'RpbxIG5HTf4',
        keywords: [
          'Power',
          'work done per unit time P=F.v watt kilowatt-hour',
          'Power explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '5-12',
        code: '5.12',
        title: 'Collisions in One and Two Dimensions',
        url: 'https://youtu.be/8OB8eIPgEkQ?si=0Kl-NCkbYzdf4UIF',
        videoId: '8OB8eIPgEkQ',
        keywords: [
          'Collisions',
          'elastic and inelastic collisions coefficient of restitution 1D 2D',
          'Collisions explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  },
  {
    id: 'rotational-motion',
    number: '6',
    name: 'System Of Particles & Rotational Motion',
    description: 'Center of mass, torque, angular momentum, moment of inertia, parallel/perpendicular axis theorems, and rigid body equilibrium.',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    videos: [
      {
        id: '6-2',
        code: '6.2',
        title: 'Centre of Gravity',
        url: 'https://youtu.be/4wlEIXGeMFM?si=cF5dAfNf3OCJkw12',
        videoId: '4wlEIXGeMFM',
        keywords: [
          'Centre of Gravity',
          'centre of mass vs centre of gravity',
          'Centre of Gravity explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-3',
        code: '6.3',
        title: 'Motion of the Centre of Mass',
        url: 'https://youtu.be/-OTix-fhEUE?si=Pz5U59cmGfWJBMOK',
        videoId: '-OTix-fhEUE',
        keywords: [
          'Motion of the Centre of Mass',
          'centre of mass velocity acceleration F_ext=M a_cm',
          'Motion of the Centre of Mass explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-4',
        code: '6.4',
        title: 'Linear Momentum of a System of Particles',
        url: 'https://youtu.be/3b_c6lghPyA?si=SPbtmfTasAbpGDYe',
        videoId: '3b_c6lghPyA',
        keywords: [
          'Linear Momentum of a System of Particles',
          'conservation of momentum of system',
          'Linear Momentum of a System of Particles explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-5',
        code: '6.5',
        title: 'Vector Product of Two Vectors (Cross Product)',
        url: 'https://youtu.be/48ByCfHYcE4?si=8izIwYyhaax7WE3g',
        videoId: '48ByCfHYcE4',
        keywords: [
          'Vector Product of Two Vectors',
          'cross product right hand rule determinant method',
          'Vector Product of Two Vectors explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-6',
        code: '6.6',
        title: 'Angular Velocity and Relation to Linear Velocity',
        url: 'https://youtu.be/FgTvlGm9jgE?si=1OoiHr0kJJWFaEOn',
        videoId: 'FgTvlGm9jgE',
        keywords: [
          'Angular Velocity and Its Relation to Linear Velocity',
          'v=r omega vector relation',
          'Angular Velocity and Its Relation to Linear Velocity explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-7',
        code: '6.7',
        title: 'Kinematics of Rotational Motion',
        url: 'https://youtu.be/WQ9AH2S8B6Y?si=Ui9EyvzWMUyzbjTN',
        videoId: 'WQ9AH2S8B6Y',
        keywords: [
          'Kinematics of Rotational Motion About a Fixed Axis',
          'rotational equations omega=omega0+alpha t theta',
          'Kinematics of Rotational Motion About a Fixed Axis explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-8',
        code: '6.8',
        title: 'Torque and Angular Momentum',
        url: 'https://youtu.be/jg4e8W44_E4?si=GkHh4el3NiJlM9sd',
        videoId: 'jg4e8W44_E4',
        keywords: [
          'Torque and Angular Momentum',
          'tau=r x F L=r x p conservation of angular momentum',
          'Torque and Angular Momentum explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-9',
        code: '6.9',
        title: 'Equilibrium of a Rigid Body',
        url: 'https://youtu.be/-e4UOdP0wzQ?si=Ddc_JPlNQy6b1NPs',
        videoId: '-e4UOdP0wzQ',
        keywords: [
          'Equilibrium of a Rigid Body',
          'translational and rotational equilibrium couple',
          'Equilibrium of a Rigid Body explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-10',
        code: '6.10',
        title: 'Moment of Inertia & Radius of Gyration',
        url: 'https://youtu.be/Ic_wFYu8xVs?si=KJgk_EB5MlUhvI4H',
        videoId: 'Ic_wFYu8xVs',
        keywords: [
          'Moment of Inertia',
          'rotational inertia I=mr^2 radius of gyration k',
          'Moment of Inertia explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      },
      {
        id: '6-11',
        code: '6.11',
        title: 'Theorems of Perpendicular and Parallel Axes',
        url: 'https://youtu.be/JrkimXqnCLw?si=VZRkNS-EDNbQoNNz',
        videoId: 'JrkimXqnCLw',
        keywords: [
          'Theorems of Perpendicular and Parallel Axes',
          'parallel axis theorem I=Icm+Md^2 perpendicular axis theorem Iz=Ix+Iy',
          'Theorems of Perpendicular and Parallel Axes explanation',
          'important concepts',
          'formulas and examples',
          'important questions'
        ]
      }
    ]
  }
];

// Helper to normalize strings for search
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
    id: 'phy-1st-year',
    name: '1st Year Junior Intermediate Physics',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop',
    desc: 'Complete mastery of Kinematics, Laws of Motion, Work-Energy-Power, Rotational Motion, Gravitation, Mechanical Properties, and Thermodynamics for 60/60 marks.'
  },
  {
    id: 'phy-2nd-year',
    name: '2nd Year Senior Intermediate Physics',
    category: 'AP / TS Intermediate',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
    desc: 'Ray Optics, Wave Optics, Electrostatics, Current Electricity, Moving Charges, Electromagnetic Induction, Alternating Current, and Modern Physics.'
  },
  {
    id: 'phy-mechanics',
    name: 'Classical Mechanics & Motion Mastery',
    category: 'Core Physics',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop',
    desc: 'Free-body diagrams, conservation laws, moment of inertia calculations, orbital mechanics, and fluid dynamics numerical shortcuts.'
  },
  {
    id: 'phy-electromagnetism',
    name: 'Electromagnetism & AC Circuits',
    category: 'Advanced Theory',
    image: 'https://images.unsplash.com/photo-1517976487541-b0e513813a48?q=80&w=600&auto=format&fit=crop',
    desc: 'Coulomb law, Gauss law, Kirchhoff laws, potentiometer problems, Biot-Savart law, cyclotron, resonance circuits, and electromagnetic waves.'
  },
  {
    id: 'phy-optics',
    name: 'Ray & Wave Optics Simulation',
    category: 'Experimental Physics',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=600&auto=format&fit=crop',
    desc: 'Prism formulas, telescope & microscope ray diagrams, Huygens wave theory, Young double slit interference, and polarization calculations.'
  },
  {
    id: 'phy-thermo',
    name: 'Thermal Physics & Kinetic Theory',
    category: 'Thermodynamics',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    desc: 'First and second laws of thermodynamics, Carnot engine efficiency, specific heat capacities, ideal gas equations, and heat conduction.'
  },
  {
    id: 'phy-jee-neet',
    name: 'JEE Main, Advanced & NEET Problem Set',
    category: 'Entrance Mastery',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    desc: 'Speed-solving tricks, multi-concept problems, previous 15-year questions, and high-difficulty numerical problem sets.'
  }
];

export default function PhysicsCurriculum({ onEnroll }) {
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
    <section id="physics-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-bold mb-4 border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
            <Atom size={15} />
            <span>AP & TS Intermediate Physics Video Lectures & Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Physics Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore topic-by-topic concept explanations, numerical derivation blueprints, vector mechanics, work-energy theorem, and rotational dynamics for a guaranteed 60/60.
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
                  These are curated sample demo lectures. <strong>Enroll now</strong> to get full access to detailed derivation notes, formula sheets, numerical problem solvers, and live 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Physics Full Course - Complete 1st Year Access')}
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
                  ? 'bg-blue-600 text-white shadow-sm'
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
                  ? 'bg-blue-600 text-white shadow-sm'
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
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
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]'
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
                  placeholder="Search physics topic or formula (e.g. Projectile, Torque, Friction, Work-Energy...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 shadow-xs"
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
              <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-medium">
                  <Search size={14} className="text-blue-600 dark:text-blue-400" />
                  <span>
                    Found <strong className="font-bold text-blue-700 dark:text-blue-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'lecture' : 'lectures'} for "<em>{searchQuery}</em>"
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
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
                  Try searching with keywords like <strong>Projectile Motion</strong>, <strong>Friction</strong>, <strong>Work-Energy Theorem</strong>, <strong>Moment of Inertia</strong>, or <strong>Torque</strong>.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
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
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop';
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                        {/* Chapter / Topic Code Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 text-white font-mono text-xs font-bold border border-white/10 flex items-center gap-1.5 shadow-sm">
                          <Layers size={12} className="text-blue-400" />
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
                          <div className="text-[11px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1.5 flex items-center gap-1">
                            <span>{video.topicName}</span>
                          </div>

                          {/* Video Title */}
                          <h3 
                            onClick={() => setActiveVideo(video)}
                            className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer leading-snug mb-2"
                            title={video.title}
                          >
                            <span className="text-blue-600 dark:text-blue-400 font-extrabold mr-1.5">{video.code}</span>
                            {video.title}
                          </h3>

                          {/* Matching Keyword Indicator tag if matched via search */}
                          {isSearching && video.matchedKeyword && (
                            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold border border-blue-200/60 dark:border-blue-800/60 max-w-full truncate">
                              <Tag size={10} className="shrink-0" />
                              <span className="truncate">Matches: {video.matchedKeyword}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                          <button
                            onClick={() => setActiveVideo(video)}
                            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
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
                    <Zap size={20} />
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
                      onClick={() => onEnroll && onEnroll(`Physics: ${mod.name}`)}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
        <div className="mt-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-blue-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-cyan-400" />
                <span>Live 1-on-1 Faculty Mentorship</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Personal Mentorship or Have Doubts in Physics Numericals & Derivations?
              </h3>
              <p className="text-blue-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, step-by-step board derivation presentation techniques, and customized chapter formula sheets to score a guaranteed 60/60 in Board Physics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Physics 1-on-1 Live Doubt & Board Coaching')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25 cursor-pointer"
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
                <span className="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-300 font-mono text-xs font-bold border border-blue-500/30 shrink-0">
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
                  if (onEnroll) onEnroll(`Physics Help: Topic ${current.code} - ${current.title}`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
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
