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
  ChevronDown,
  ArrowRight,
  Tv,
  Tag,
  Sparkles,
  GitFork,
  ListTree,
  Folder,
  FolderOpen,
  FileText,
  CornerDownRight,
  Compass,
  Video
} from 'lucide-react';
import { fetchStudentVideos } from '../../services/api';

// Raw topic data with nested children hierarchy for Function chapter
// Dynamic numbering generator automatically assigns codes (1.0, 1.0.0, 1.0.0.0, 1.0.0.0.0, etc.)
const RAW_TOPICS_DATA = [
  {
    id: 'functions',
    number: '1',
    name: 'Functions',
    chapterTitle: '1 Function',
    description: 'Ordered pairs, relations, function types, inverse theorems, and real-valued domains & ranges.',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    videos: [
      {
        id: '1-0',
        title: 'Ordered Pairs',
        description: 'Complete foundational lecture on Ordered Pairs covering concepts, theorems, Cartesian products, and triplets.',
        url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
        videoId: 'jQUrfmX0uko',
        keywords: [
          'Ordered Pairs',
          'Cartesian Product',
          'Equality of Ordered Pairs',
          'Ordered Triplets',
          'Number of Elements in Cartesian Product'
        ],
        children: [
          {
            id: '1-0-0',
            title: 'Definition & Equality of Ordered Pairs',
            description: 'Concept of paired elements (a, b), first & second components, and equality theorem: (a, b) = (c, d) iff a = c and b = d.',
            url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
            videoId: 'jQUrfmX0uko',
            children: [
              {
                id: '1-0-0-0',
                title: 'Definition of an Ordered Pair',
                description: 'Formal definition of ordered pair (a, b) where order of elements matters, distinct from unordered sets {a, b}.',
                url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                videoId: 'jQUrfmX0uko',
                children: [
                  {
                    id: '1-0-0-0-0',
                    title: 'Meaning and Notation',
                    description: 'Understanding (a, b) notation, first element a ∈ A and second element b ∈ B.',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  },
                  {
                    id: '1-0-0-0-1',
                    title: 'Examples of Ordered Pairs',
                    description: 'Real-world pairs and coordinate geometry plane examples (x, y).',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  }
                ]
              },
              {
                id: '1-0-0-1',
                title: 'Equality of Ordered Pairs',
                description: 'Conditions and theorems under which two ordered pairs (a, b) and (c, d) are identical.',
                url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                videoId: 'jQUrfmX0uko',
                children: [
                  {
                    id: '1-0-0-1-0',
                    title: 'Conditions for Equality',
                    description: 'Algebraic condition: (a, b) = (c, d) if and only if a = c and b = d.',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  },
                  {
                    id: '1-0-0-1-1',
                    title: 'Solved Examples',
                    description: 'Exam problems solving for unknown variables x, y given (x + 1, y - 2) = (3, 1).',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: '1-0-1',
            title: 'Cartesian Product',
            description: 'Definition of Cartesian product A × B = {(a, b) : a ∈ A, b ∈ B}, arrow diagrams, and algebraic properties.',
            url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
            videoId: 'jQUrfmX0uko',
            children: [
              {
                id: '1-0-1-0',
                title: 'Definition of Cartesian Product',
                description: 'Set of all ordered pairs formed from set A and set B.',
                url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                videoId: 'jQUrfmX0uko',
                children: [
                  {
                    id: '1-0-1-0-0',
                    title: 'Meaning and Notation',
                    description: 'Formal set builder notation A × B = {(a, b) : a ∈ A and b ∈ B}.',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  },
                  {
                    id: '1-0-1-0-1',
                    title: 'Examples',
                    description: 'Calculating Cartesian product sets A × B and B × A with finite sets.',
                    url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                    videoId: 'jQUrfmX0uko',
                    children: []
                  }
                ]
              },
              {
                id: '1-0-1-1',
                title: 'Properties of Cartesian Product',
                description: 'Distributive properties over union and intersection, non-commutativity A × B ≠ B × A, and cardinality.',
                url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
                videoId: 'jQUrfmX0uko',
                children: []
              }
            ]
          },
          {
            id: '1-0-2',
            title: 'Triplets and Their Properties',
            description: 'Ordered triplets (a, b, c) in A × B × C, 3D coordinate space representation, and cardinality formula n(A × B × C).',
            url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
            videoId: 'jQUrfmX0uko',
            children: []
          }
        ]
      },
      {
        id: '1-1',
        title: 'Types of Functions – Definitions',
        description: 'One-One, Onto, Bijective, Injective, Surjective, Identity, and Constant functions with domain, codomain, range.',
        url: 'https://youtu.be/7JZ0IfCQ488?si=cvqx900nZChKmBXZ',
        videoId: '7JZ0IfCQ488',
        keywords: [
          'Types of Functions',
          'One-One Function',
          'Many-One Function',
          'Into Function',
          'Onto Function',
          'Bijective Function',
          'Injective Function',
          'Surjective Function',
          'Identity Function',
          'Constant Function',
          'Domain Codomain Range'
        ]
      },
      {
        id: '1-2',
        title: 'Inverse Functions and Theorems',
        description: 'Inverse of bijective functions, composite functions, and foundational inverse theorems.',
        url: 'https://youtu.be/9fJsrnE1go0?si=SxRsU1JAB7rvkVIl',
        videoId: '9fJsrnE1go0',
        keywords: [
          'Inverse Functions',
          'Inverse of a Function',
          'One-One Function Inverse',
          'Inverse Function Theorems',
          'Composite Functions',
          'Finding Inverse Function',
          'Properties of Inverse Functions'
        ]
      },
      {
        id: '1-3',
        title: 'Real-Valued Functions – Domain, Range and Inverse',
        description: 'Finding domains and ranges of square roots, rational functions, and absolute value functions.',
        url: 'https://youtu.be/FdK9_Fp76cw?si=GlJrwQ-IVeJTY8Pp',
        videoId: 'FdK9_Fp76cw',
        keywords: [
          'Real Valued Functions',
          'Domain of Function',
          'Range of Function',
          'Inverse of Real Valued Function',
          'Domain and Range',
          'Finding Domain',
          'Finding Range'
        ]
      }
    ]
  },
  {
    id: 'induction',
    number: '2',
    name: 'Mathematical Induction',
    chapterTitle: '2 Mathematical Induction',
    description: 'Foundational principles of mathematical induction, proof theorems, applications, and divisibility proofs.',
    color: 'from-indigo-600 to-violet-600',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    videos: [
      {
        id: '2-1',
        title: 'Principles of Mathematical Induction and Theorems',
        description: 'Base step, inductive hypothesis, and inductive verification theorems.',
        url: 'https://youtu.be/JTgWbq-S6Zc?si=d-WF3hNP-7qMx12i',
        videoId: 'JTgWbq-S6Zc',
        keywords: [
          'Principle of Mathematical Induction',
          'PMI',
          'Mathematical Induction Theorem',
          'Base Step',
          'Inductive Hypothesis',
          'Inductive Step'
        ]
      },
      {
        id: '2-2',
        title: 'Applications of Mathematical Induction',
        description: 'Mathematical induction problems, sum formulas, and arithmetic series proofs.',
        url: 'https://youtu.be/Wtc9PNk7f40?si=B7zCA6o3ADkMqCUi',
        videoId: 'Wtc9PNk7f40',
        keywords: [
          'Applications of Mathematical Induction',
          'Mathematical Induction Problems',
          'Proof by Induction',
          'Sum Formula by Induction',
          'Series by Mathematical Induction'
        ]
      },
      {
        id: '2-3',
        title: 'Problems on Divisibility',
        description: 'Induction divisibility problems, number theory induction, and algebraic divisibility tests.',
        url: 'https://youtu.be/0DMBjvUdtMo?si=0DDlrwdYyD9lhALx',
        videoId: '0DMBjvUdtMo',
        keywords: [
          'Divisibility by Mathematical Induction',
          'Divisibility Problems',
          'Divisibility Proof',
          'Induction Divisibility Problems',
          'Number Theory Induction'
        ]
      }
    ]
  },
  {
    id: 'matrices',
    number: '3',
    name: 'Matrices',
    chapterTitle: '3 Matrices',
    description: 'Types, multiplication, transpose, determinants, adjoint, matrix rank, and systems of linear equations.',
    color: 'from-violet-600 to-purple-600',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    videos: [
      {
        id: '3-1',
        title: 'Types of Matrices',
        description: 'Row, column, square, zero, diagonal, scalar, and identity matrix definitions.',
        url: 'https://youtu.be/3-s0IwdDcgE?si=dO_AU4OLmV4Uac9p',
        videoId: '3-s0IwdDcgE',
        keywords: [
          'Types of Matrices',
          'Row Matrix',
          'Column Matrix',
          'Square Matrix',
          'Zero Matrix',
          'Diagonal Matrix',
          'Scalar Matrix',
          'Identity Matrix'
        ]
      },
      {
        id: '3-2',
        title: 'Operations on Matrices – Addition, Subtraction and Scalar Multiplication',
        description: 'Matrix algebra, conformable matrices, commutative and associative properties.',
        url: 'https://youtu.be/0DMBjvUdtMo',
        videoId: '0DMBjvUdtMo',
        keywords: [
          'Matrix Addition',
          'Matrix Subtraction',
          'Scalar Multiplication',
          'Properties of Matrix Addition',
          'Matrix Operations'
        ]
      },
      {
        id: '3-3',
        title: 'Multiplication of Matrices',
        description: 'Row-by-column matrix multiplication, properties, and non-commutativity.',
        url: 'https://youtu.be/3-s0IwdDcgE',
        videoId: '3-s0IwdDcgE',
        keywords: [
          'Matrix Multiplication',
          'Product of Matrices',
          'Properties of Matrix Multiplication',
          'AB not equal to BA'
        ]
      },
      {
        id: '3-4',
        title: 'Transpose of a Matrix – Symmetric and Skew-Symmetric Matrices',
        description: 'Transpose rules (AB)T = BT AT, symmetric matrices A = AT, and skew-symmetric matrices A = -AT.',
        url: 'https://youtu.be/0DMBjvUdtMo',
        videoId: '0DMBjvUdtMo',
        keywords: [
          'Transpose of Matrix',
          'Symmetric Matrix',
          'Skew Symmetric Matrix',
          'Transpose Properties'
        ]
      },
      {
        id: '3-5',
        title: 'Determinants – Definition, Expansion and Properties',
        description: 'Determinant calculation 2x2 and 3x3, row/column operations, and expansion by minors.',
        url: 'https://youtu.be/3-s0IwdDcgE',
        videoId: '3-s0IwdDcgE',
        keywords: [
          'Determinants',
          'Properties of Determinants',
          'Determinant of 3x3 Matrix',
          'Expansion of Determinant',
          'Minors and Cofactors'
        ]
      },
      {
        id: '3-6',
        title: 'Adjoint and Inverse of a Matrix',
        description: 'Cofactor matrix, adjoint calculation, and inverse formula A^-1 = adj(A)/det(A).',
        url: 'https://youtu.be/0DMBjvUdtMo',
        videoId: '0DMBjvUdtMo',
        keywords: [
          'Adjoint of Matrix',
          'Inverse of Matrix',
          'Finding Inverse Matrix',
          'Singular Non Singular Matrix'
        ]
      },
      {
        id: '3-7',
        title: 'Solving Linear Equations – Cramer’s Rule and Matrix Inversion Method',
        description: 'Consistent systems, Cramer rule Delta methods, and matrix inversion AX = B.',
        url: 'https://youtu.be/3-s0IwdDcgE',
        videoId: '3-s0IwdDcgE',
        keywords: [
          'Cramer Rule',
          'Matrix Inversion Method',
          'System of Linear Equations',
          'Solve by Cramer Rule',
          'Solve by Matrix Method'
        ]
      },
      {
        id: '3-8',
        title: 'Gauss-Jordan Method & Rank of a Matrix',
        description: 'Row operations, echelon form, rank calculation, and Gaussian elimination.',
        url: 'https://youtu.be/0DMBjvUdtMo',
        videoId: '0DMBjvUdtMo',
        keywords: [
          'Gauss Jordan Method',
          'Rank of Matrix',
          'Echelon Form',
          'Elementary Row Operations'
        ]
      }
    ]
  },
  {
    id: 'addition-vectors',
    number: '4',
    name: 'Addition of Vectors',
    chapterTitle: '4 Addition of Vectors',
    description: 'Scalar and vector concepts, triangle & parallelogram addition laws, position vectors, and section formulas.',
    color: 'from-cyan-600 to-blue-600',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    videos: [
      {
        id: '4-1',
        title: 'Vectors as Directed Line Segments',
        description: 'Magnitude, direction, initial and terminal points, and geometric representation.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Vectors as Directed Line Segments',
          'Magnitude of Vector',
          'Direction of Vector',
          'Vector Basics'
        ]
      },
      {
        id: '4-2',
        title: 'Types of Vectors',
        description: 'Zero, unit, co-initial, collinear, equal, and negative vector definitions.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Types of Vectors',
          'Unit Vector',
          'Null Vector',
          'Collinear Vectors',
          'Equal Vectors'
        ]
      },
      {
        id: '4-3',
        title: 'Triangle Law & Parallelogram Law of Vector Addition',
        description: 'Geometric addition proofs, resultant magnitude, and direction formulas.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Triangle Law of Vectors',
          'Parallelogram Law of Vectors',
          'Resultant Vector',
          'Vector Addition Laws'
        ]
      },
      {
        id: '4-4',
        title: 'Position Vector and Section Formula',
        description: 'Internal and external division, midpoint vector, and centroid coordinates.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Position Vector',
          'Section Formula Vectors',
          'Internal Division',
          'Centroid of Triangle Vectors'
        ]
      },
      {
        id: '4-5',
        title: 'Collinearity of Three Points and Coplanarity of Four Points',
        description: 'Linear combinations, coplanar conditions, and scalar equations for coplanarity.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Collinear Points Vectors',
          'Coplanar Points Vectors',
          'Condition for Collinearity',
          'Linear Combination Vectors'
        ]
      }
    ]
  },
  {
    id: 'product-vectors',
    number: '5',
    name: 'Product of Vectors',
    chapterTitle: '5 Product of Vectors',
    description: 'Dot products, cross products, scalar triple products, and vector equations of planes.',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    videos: [
      {
        id: '5-1',
        title: 'Scalar Product (Dot Product) – Definition and Properties',
        description: 'Definition a · b = |a||b|cosθ, perpendicularity conditions, and distributive laws.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Scalar Product',
          'Dot Product',
          'Properties of Dot Product',
          'Angle Between Vectors',
          'Perpendicular Vectors'
        ]
      },
      {
        id: '5-2',
        title: 'Vector Product (Cross Product) – Definition and Properties',
        description: 'Definition a × b = |a||b|sinθ n̂, right hand thumb rule, determinant calculation, and vector areas.',
        url: 'https://youtu.be/jQUrfmX0uko?si=F6A0izpSfZNcAW3S',
        videoId: 'jQUrfmX0uko',
        keywords: [
          'Cross Product',
          'Vector Product',
          'Properties of Cross Product',
          'Vector Area',
          'Determinant Cross Product'
        ]
      },
      {
        id: '5-3',
        title: 'Scalar Triple Product & Coplanarity',
        description: 'Volume of parallelepiped [a b c], box product properties, and coplanarity proofs.',
        url: 'https://youtu.be/rhwQ_5ZJ-8g?si=asTabyQEjR8IRRU6',
        videoId: 'rhwQ_5ZJ-8g',
        keywords: [
          'Scalar Triple Product',
          'Box Product',
          'Volume of Parallelepiped',
          'Coplanarity Condition'
        ]
      }
    ]
  }
];

// Dynamic numbering assignment function
// Assigns 1.0, 1.0.0, 1.0.0.0, 1.0.0.0.0... dynamically based on parent-child relationship
function assignDynamicCodesToChapter(chapter) {
  const chapterCode = String(chapter.number || '1');

  function processNode(node, index, parentCode) {
    const defaultCode = `${parentCode}.${index}`;
    const code = (node.code && String(node.code).startsWith(parentCode)) ? node.code : (node.code || defaultCode);
    const children = (node.children || []).map((child, cIdx) => 
      processNode(child, cIdx, code)
    );
    return {
      ...node,
      code,
      children
    };
  }

  const videos = (chapter.videos || []).map((video, idx) => {
    const defaultCode = `${chapterCode}.${idx}`;
    const code = (video.code && String(video.code).startsWith(chapterCode)) ? video.code : (video.code || defaultCode);
    const children = (video.children || []).map((child, cIdx) => 
      processNode(child, cIdx, code)
    );
    return {
      ...video,
      code,
      children
    };
  });

  return {
    ...chapter,
    videos
  };
}

export const TOPICS_DATA = RAW_TOPICS_DATA.map(assignDynamicCodesToChapter);

// Helper to extract YouTube ID
function extractYouTubeId(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : '';
}

// Helper to normalize strings for search
const normalize = (str) => 
  (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Flatten nodes recursively to retrieve trail & searchable entries
function flattenNodeTree(node, ancestors = []) {
  const currentTrail = [...ancestors, { id: node.id, title: node.title, code: node.code, description: node.description, url: node.url, videoId: node.videoId }];
  let list = [{ ...node, trail: currentTrail }];
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      list = list.concat(flattenNodeTree(child, currentTrail));
    });
  }
  return list;
}

// Flatten all videos for top-level search and navigation
const ALL_VIDEOS = TOPICS_DATA.flatMap(topic => 
  topic.videos.map(video => ({
    ...video,
    topicId: topic.id,
    topicName: topic.name,
    chapterTitle: topic.chapterTitle || `${topic.number} ${topic.name}`,
    topicNumber: topic.number,
    topicColor: topic.color,
    badgeColor: topic.badgeColor
  }))
);

// Extract all playable lessons in a chapter sequentially for playlist navigation
function getAllChapterLessons(chapter) {
  const chapterTitle = chapter.chapterTitle || `${chapter.number} ${chapter.name}`;
  const list = [];

  function traverse(node, ancestors) {
    const trail = [...ancestors, { id: node.id, title: node.title, code: node.code }];
    const lessonItem = {
      ...node,
      chapterTitle,
      chapterNumber: chapter.number,
      chapterId: chapter.id,
      trail
    };
    list.push(lessonItem);
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child, trail));
    }
  }

  (chapter.videos || []).forEach(video => {
    traverse(video, [{ id: chapter.id, title: chapterTitle, code: chapter.number }]);
  });

  return list;
}

// Find ancestor trail to selected node
function findTrail(root, targetId) {
  if (root.id === targetId) return [root];
  if (!root.children) return null;
  for (const child of root.children) {
    const sub = findTrail(child, targetId);
    if (sub) return [root, ...sub];
  }
  return null;
}

// Find full chapter breadcrumb trail
function findChapterTrail(chapter, targetId) {
  const chapterNode = {
    id: chapter.id,
    title: chapter.chapterTitle || `${chapter.number} ${chapter.name}`,
    code: chapter.number
  };
  for (const video of (chapter.videos || [])) {
    const sub = findTrail(video, targetId);
    if (sub) {
      return [chapterNode, ...sub];
    }
  }
  return [chapterNode];
}

// Collect all node IDs in tree for Expand All
function collectAllNodeIds(node) {
  let ids = [node.id];
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      ids = ids.concat(collectAllNodeIds(child));
    });
  }
  return ids;
}

// Recursive Collapsible Topic Node for Sidebar Navigation (The Collapse Method)
function CollapsibleTopicNode({
  node,
  depth = 0,
  activeId,
  onSelectLesson,
  expandedMap,
  toggleExpand,
  searchFilter
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = Boolean(expandedMap[node.id]);
  const isSelected = activeId === node.id;

  const matchesSearch = !searchFilter || 
    node.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    node.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (node.description && node.description.toLowerCase().includes(searchFilter.toLowerCase()));

  if (searchFilter && !matchesSearch) {
    const hasMatchingChild = (node.children || []).some(c => 
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.code.toLowerCase().includes(searchFilter.toLowerCase())
    );
    if (!hasMatchingChild) return null;
  }

  // Visual styling variants by depth
  const isRoot = depth === 0;
  const isLevel1 = depth === 1;

  // Background and border styling
  let cardBg = '';
  if (isSelected) {
    cardBg = 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/35 ring-1 ring-white/30 border-transparent';
  } else if (isRoot) {
    cardBg = 'bg-slate-800/90 hover:bg-slate-800 border-indigo-500/40 text-white shadow-sm';
  } else if (isLevel1) {
    cardBg = 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/70 text-slate-200 shadow-xs';
  } else {
    cardBg = 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50 text-slate-300';
  }

  // Code badge styling
  let badgeStyle = '';
  if (isSelected) {
    badgeStyle = 'bg-white/20 text-white border-white/30 font-black';
  } else if (isRoot) {
    badgeStyle = 'bg-indigo-500/25 text-indigo-300 border-indigo-400/40 font-black';
  } else if (isLevel1) {
    badgeStyle = 'bg-indigo-950 text-indigo-300 border-indigo-800/70 font-bold';
  } else {
    badgeStyle = 'bg-slate-900 text-indigo-400 border-slate-700/60 font-semibold';
  }

  return (
    <div className="flex flex-col select-none">
      <div
        className={`group flex items-center justify-between gap-2.5 py-2 px-3 rounded-xl border transition-all duration-150 cursor-pointer ${cardBg}`}
        onClick={() => {
          onSelectLesson(node);
          if (hasChildren && !isExpanded) {
            toggleExpand(node.id);
          }
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Chevron expand/collapse toggle */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                isSelected 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              isSelected ? 'text-white' : 'text-slate-500'
            }`}>
              <Play size={11} className={isSelected ? 'fill-white text-white' : 'fill-slate-500 text-slate-500'} />
            </div>
          )}

          {/* Dynamic Code Badge */}
          <span className={`font-mono text-xs px-2 py-0.5 rounded-md border shrink-0 tracking-tight ${badgeStyle}`}>
            {node.code}
          </span>

          {/* Title */}
          <span className={`text-xs sm:text-[13px] leading-snug break-words ${
            isSelected 
              ? 'text-white font-black' 
              : isRoot 
                ? 'text-white font-bold' 
                : 'text-slate-200 font-medium group-hover:text-white'
          }`}>
            {node.title}
          </span>
        </div>

        {/* Right Status Badge */}
        <div className="shrink-0 flex items-center gap-1.5 ml-2">
          {isSelected ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold text-white tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PLAYING
            </span>
          ) : hasChildren ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-700/40 text-slate-400 group-hover:text-slate-300">
              {node.children.length} {node.children.length === 1 ? 'part' : 'parts'}
            </span>
          ) : null}
        </div>
      </div>

      {/* Recursive Children with Tree Connector Branch Guides */}
      {hasChildren && isExpanded && (
        <div className="relative ml-5 pl-4 border-l-2 border-indigo-500/25 space-y-1.5 my-1.5">
          {node.children.map((child) => (
            <div 
              key={child.id} 
              className="relative before:absolute before:-left-4 before:top-4 before:w-3.5 before:h-0.5 before:bg-indigo-500/25 before:rounded-full"
            >
              <CollapsibleTopicNode
                node={child}
                depth={depth + 1}
                activeId={activeId}
                onSelectLesson={onSelectLesson}
                expandedMap={expandedMap}
                toggleExpand={toggleExpand}
                searchFilter={searchFilter}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Full-Page Interactive Classroom Lecture Player
function FullPageLecturePlayer({ initialVideo, onClose, onEnroll, topicsData = [] }) {
  // Find current chapter
  const chapter = useMemo(() => {
    const list = topicsData && topicsData.length > 0 ? topicsData : TOPICS_DATA;
    if (!initialVideo) return list[0];
    return list.find(c => 
      c.id === initialVideo.topicId || 
      c.number === initialVideo.topicNumber ||
      (c.videos && c.videos.some(v => v.id === initialVideo.id))
    ) || list[0];
  }, [initialVideo, topicsData]);

  // Find the exact top-level topic clicked (e.g. 1.0 Ordered Pairs)
  const rootTopic = useMemo(() => {
    if (!initialVideo) return null;
    const directMatch = (chapter.videos || []).find(v => v.id === initialVideo.id);
    if (directMatch) return directMatch;
    for (const v of (chapter.videos || [])) {
      const trail = findTrail(v, initialVideo.id);
      if (trail) return v;
    }
    return initialVideo;
  }, [chapter, initialVideo]);

  // Only lessons of this specific topic (remaining 1.1, 1.2, 1.3 are NOT included)
  const allLessons = useMemo(() => {
    if (!rootTopic) return [];
    return flattenNodeTree(rootTopic);
  }, [rootTopic]);

  // Current active playing lesson
  const [currentLesson, setCurrentLesson] = useState(() => {
    if (initialVideo?.activeSubTopic) return initialVideo.activeSubTopic;
    const match = allLessons.find(l => l.id === initialVideo?.id);
    return match || allLessons[0] || initialVideo;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Expand map for collapse method
  const [expandedMap, setExpandedMap] = useState(() => {
    const map = {};
    if (rootTopic) {
      map[rootTopic.id] = true;
      (rootTopic.children || []).forEach(c => {
        map[c.id] = true;
      });
    }
    // Auto expand ancestors of current lesson
    if (currentLesson?.trail) {
      currentLesson.trail.forEach(t => { map[t.id] = true; });
    }
    return map;
  });

  const toggleExpand = (id) => {
    setExpandedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCollapseAll = () => {
    setExpandedMap({});
  };

  const handleExpandAll = () => {
    if (!rootTopic) return;
    const all = {};
    const ids = collectAllNodeIds(rootTopic);
    ids.forEach(id => { all[id] = true; });
    setExpandedMap(all);
  };

  // Find index in playlist
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = allLessons[currentIndex - 1];
      setCurrentLesson(prev);
      if (prev.trail) {
        setExpandedMap(old => {
          const updated = { ...old };
          prev.trail.forEach(t => { updated[t.id] = true; });
          return updated;
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      setCurrentLesson(next);
      if (next.trail) {
        setExpandedMap(old => {
          const updated = { ...old };
          next.trail.forEach(t => { updated[t.id] = true; });
          return updated;
        });
      }
    }
  };

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    if (lesson.trail) {
      setExpandedMap(old => {
        const updated = { ...old };
        lesson.trail.forEach(t => { updated[t.id] = true; });
        return updated;
      });
    }
  };

  // Dynamic breadcrumb trail
  const breadcrumbTrail = useMemo(() => {
    const chapterNode = {
      id: chapter.id,
      title: chapter.chapterTitle || `${chapter.number} ${chapter.name}`,
      code: chapter.number
    };
    if (!rootTopic) return [chapterNode];
    const sub = findTrail(rootTopic, currentLesson.id) || [rootTopic];
    return [chapterNode, ...sub];
  }, [chapter, rootTopic, currentLesson]);

  const displayVideoId = currentLesson.videoId || initialVideo.videoId;
  const displayUrl = currentLesson.url || initialVideo.url;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Top Classroom Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            title="Return to syllabus"
          >
            <ChevronLeft size={16} />
            <span>Back to Syllabus</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-1 text-xs text-slate-400 overflow-x-auto scrollbar-none whitespace-nowrap">
            <Compass size={13} className="text-indigo-400 shrink-0 mr-1" />
            {breadcrumbTrail.map((crumb, idx) => {
              const isLast = idx === breadcrumbTrail.length - 1;
              return (
                <React.Fragment key={crumb.id || idx}>
                  {idx > 0 && <span className="text-slate-600">›</span>}
                  <span
                    className={`transition-colors ${
                      isLast
                        ? 'font-black text-indigo-400'
                        : 'text-slate-400 hover:text-white cursor-pointer'
                    }`}
                    onClick={() => {
                      const match = allLessons.find(l => l.id === crumb.id);
                      if (match) handleSelectLesson(match);
                    }}
                  >
                    {crumb.code ? `${crumb.code}: ` : ''}{crumb.title}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              sidebarOpen 
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={sidebarOpen ? 'Hide Syllabus Sidebar' : 'Show Syllabus Sidebar'}
          >
            <ListTree size={14} />
            <span className="hidden md:inline">{sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}</span>
          </button>

          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close lecture"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Full Page Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Video Theater Player & Detailed Lesson Notes */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-black/40 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Responsive 16:9 Video Container */}
          <div className="relative w-full aspect-video max-h-[64vh] bg-black flex items-center justify-center shadow-2xl">
            {displayVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${displayVideoId}?autoplay=1&rel=0`}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : displayUrl ? (
              <video
                src={displayUrl}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="text-slate-400 text-sm">Video media unavailable</div>
            )}
          </div>

          {/* Lesson Details & Interactive Controls */}
          <div className="p-5 sm:p-8 space-y-5 max-w-5xl mx-auto w-full">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-mono text-xs font-black shadow-sm shadow-indigo-600/30">
                    Lesson {currentLesson.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {chapter.chapterTitle || '1 Function'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {currentLesson.title}
                </h1>
              </div>

              {/* Sequential Navigation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} /> Prev Lesson
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= allLessons.length - 1}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Lesson <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Description / Lesson Content Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-amber-400" />
                <span>Lecture Notes & Key Concepts</span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Ask Doubt Action Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                  Have doubts in "{currentLesson.code}: {currentLesson.title}"?
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Connect with senior Intermediate mathematics faculty for step-by-step clarification.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onEnroll) onEnroll(`Maths Help: Topic ${currentLesson.code} - ${currentLesson.title}`);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-lg shadow-indigo-600/25"
              >
                <span>Ask Doubt in this Topic</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Dedicated Syllabus Hierarchy Sidebar (The Collapse Method) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-[420px] xl:w-[460px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-2xl">
            {/* Sidebar Header */}
            <div className="p-4 bg-slate-900/95 border-b border-slate-800 space-y-3 shrink-0">
              {/* Header Title & Lesson Count */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-indigo-400">
                    Topic Hierarchy
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-xs font-bold border border-indigo-800/60 shadow-xs">
                  {allLessons.length} {allLessons.length === 1 ? 'Lesson' : 'Lessons'}
                </span>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span className="text-indigo-400 font-mono">{rootTopic?.code}:</span>
                  <span>{rootTopic?.title}</span>
                </h2>
                
                {/* Now Playing pill */}
                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-400 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Playing:
                  </span>
                  <span className="font-mono font-bold text-indigo-300 shrink-0">{currentLesson.code}</span>
                  <span className="truncate font-medium text-white">{currentLesson.title}</span>
                </div>
              </div>

              {/* Action Toolbar: Collapse/Expand + Search */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCollapseAll}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1 shadow-xs"
                    title="Collapse all subtopics"
                  >
                    <span>−</span>
                    <span>Collapse All</span>
                  </button>
                  <button
                    onClick={handleExpandAll}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-slate-700/60 flex items-center gap-1 shadow-xs"
                    title="Expand all subtopics"
                  >
                    <span>+</span>
                    <span>Expand All</span>
                  </button>
                </div>

                <div className="relative flex-1 max-w-[190px]">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search subtopic..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-800/90 text-white text-xs border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500 transition-all"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Collapsible Hierarchy Syllabus Tree Body - ONLY rootTopic and its nested subtopics */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-indigo-500/30">
              {rootTopic && (
                <CollapsibleTopicNode
                  key={rootTopic.id}
                  node={rootTopic}
                  depth={0}
                  activeId={currentLesson.id}
                  onSelectLesson={handleSelectLesson}
                  expandedMap={expandedMap}
                  toggleExpand={toggleExpand}
                  searchFilter={searchFilter}
                />
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

// Clean and Responsive Video Card for the Main Curriculum Grid
function MathsVideoCard({ video, isSearching, onSelectVideo }) {
  const hasChildren = Boolean(video.children && video.children.length > 0);
  const allFlattened = useMemo(() => flattenNodeTree(video), [video]);

  const handlePlay = () => {
    onSelectVideo(video);
  };

  let cleanVideoId = video.videoId;
  let cleanThumb = video.thumbnailUrl || '';
  const BAD_IDS = ['2TzFm9u5e10', 'WUvTyaaNjfo', 'YV8R-iEwI10', 's8z_gV4d1Y0', '012s6N3B6xM', 'vQ881vB7x6k', 'o10h4_k86M0', 'j49s-jEw1Y0', 'k29B_v16-9M', 'w40B_v16-9M', '1m4q_3y-89k'];

  if (BAD_IDS.includes(cleanVideoId) || BAD_IDS.some(bad => cleanThumb.includes(bad))) {
    cleanVideoId = '3-s0IwdDcgE';
    cleanThumb = 'https://img.youtube.com/vi/3-s0IwdDcgE/hqdefault.jpg';
  }

  const thumbnailUrl =
    cleanThumb ||
    (cleanVideoId && !BAD_IDS.includes(cleanVideoId)
      ? `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop');

  return (
    <div className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border ${
      hasChildren 
        ? 'border-indigo-300 dark:border-indigo-700/80 ring-2 ring-indigo-500/10 dark:ring-indigo-500/20' 
        : 'border-slate-200/80 dark:border-slate-800'
    } hover:-translate-y-1`}>
      
      {/* Thumbnail Container */}
      <div 
        onClick={handlePlay}
        className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Chapter / Topic Code Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <div className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/65 text-white font-mono text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm">
            <Layers size={12} className="text-indigo-400" />
            <span>Lesson {video.code}</span>
          </div>
          {video.isDbUploaded && (
            <div className="px-2 py-0.5 rounded-lg bg-emerald-600/95 text-white font-sans text-[10px] font-extrabold border border-emerald-400/50 shadow-sm flex items-center gap-1">
              <CheckCircle2 size={10} />
              <span>Admin Uploaded</span>
            </div>
          )}
        </div>

        {/* Sub-Topics Count Tag on Thumbnail */}
        {hasChildren && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg backdrop-blur-md bg-indigo-600/95 text-white font-sans text-[10px] font-extrabold border border-indigo-400/40 flex items-center gap-1 shadow-sm">
            <GitFork size={11} className="text-amber-300" />
            <span>{allFlattened.length} Subtopics</span>
          </div>
        )}

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-115 transition-transform duration-300 ring-4 ring-white/30">
            <Play size={20} className="ml-0.5 fill-white" />
          </div>
        </div>

        {/* Video Media Type Indicator */}
        <div className="absolute bottom-2.5 right-3 text-[11px] font-bold text-white/90 drop-shadow flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
          <span>{video.videoId ? 'YouTube Lecture' : 'Video Lecture'}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Main Chapter Badge */}
          <div className="text-[11px] font-extrabold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-2 flex items-center justify-between">
            <span>{video.chapterTitle || `${video.topicNumber} Function`}</span>
            {hasChildren && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold border border-indigo-200/60 dark:border-indigo-800/60">
                Hierarchical Syllabus
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={handlePlay}
            className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer leading-snug mb-2"
            title={video.title}
          >
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold mr-1.5">{video.code}:</span>
            {video.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {video.description}
          </p>

          {/* Subtopic summary preview pill for hierarchical topics */}
          {hasChildren && (
            <div className="mb-3 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <ListTree size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Interactive Syllabus</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {allFlattened.length} Subtopics
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                Includes {allFlattened.slice(0, 3).map(c => `${c.code} ${c.title}`).join(' • ')}{allFlattened.length > 3 ? ' with complete collapsible navigation inside the lecture.' : '.'}
              </p>
            </div>
          )}

          {/* Matching Keyword Indicator */}
          {isSearching && video.matchedKeyword && (
            <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold border border-indigo-200/60 dark:border-indigo-800/60 max-w-full truncate">
              <Tag size={10} className="shrink-0" />
              <span className="truncate">Matches: {video.matchedKeyword}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm shadow-indigo-600/20"
          >
            <Play size={14} className="fill-white" />
            <span>Watch Lecture ({video.code})</span>
          </button>

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={`Open ${video.title} on YouTube`}
            aria-label={`Open ${video.title} on YouTube`}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

// Complete Hierarchical Chapter Roadmap Modal Component
function HierarchicalRoadmapModal({ chapterTopic, onClose, onSelectVideo }) {
  const [searchFilter, setSearchFilter] = useState('');
  const allNodes = useMemo(() => {
    if (!chapterTopic) return [];
    return flattenNodeTree(chapterTopic);
  }, [chapterTopic]);

  const [expandedMap, setExpandedMap] = useState(() => {
    if (!chapterTopic) return {};
    const allIds = collectAllNodeIds(chapterTopic);
    const m = {};
    allIds.forEach(id => { m[id] = true; });
    return m;
  });

  const toggleExpand = (id) => {
    setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    const allIds = collectAllNodeIds(chapterTopic);
    const m = {};
    allIds.forEach(id => { m[id] = true; });
    setExpandedMap(m);
  };

  const handleCollapseAll = () => {
    setExpandedMap({});
  };

  if (!chapterTopic) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Roadmap Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <ListTree size={22} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Complete Chapter Learning Tree
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {chapterTopic.chapterTitle || '1 Function'} Roadmap
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Roadmap Toolbar */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Collapse All
            </button>
            <span className="text-xs text-slate-400 ml-2">
              Total Lessons: <strong>{allNodes.length}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter topics..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Roadmap Tree Body */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-slate-700">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                  {chapterTopic.code}
                </span>
                <span className="ml-2 font-bold text-slate-900 dark:text-white">
                  {chapterTopic.title}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {chapterTopic.description}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onSelectVideo(chapterTopic);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <Play size={12} className="fill-white" /> Watch
              </button>
            </div>

            {/* Nested children */}
            <div className="pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 ml-3 space-y-2">
              {chapterTopic.children && chapterTopic.children.map((child) => (
                <RoadmapTreeNode
                  key={child.id}
                  node={child}
                  depth={0}
                  expandedMap={expandedMap}
                  toggleExpand={toggleExpand}
                  onSelectLesson={(lesson) => {
                    onClose();
                    onSelectVideo(lesson);
                  }}
                  searchFilter={searchFilter}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Recursive Node for Roadmap Modal
function RoadmapTreeNode({ node, depth = 0, expandedMap, toggleExpand, onSelectLesson, searchFilter }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = Boolean(expandedMap[node.id]);

  const matchesSearch = !searchFilter || 
    node.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    node.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (node.description && node.description.toLowerCase().includes(searchFilter.toLowerCase()));

  if (searchFilter && !matchesSearch) {
    // If has matching descendants, still show
    const hasMatchingChild = (node.children || []).some(c => 
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.code.toLowerCase().includes(searchFilter.toLowerCase())
    );
    if (!hasMatchingChild) return null;
  }

  return (
    <div className="flex flex-col space-y-1">
      <div 
        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
          matchesSearch && searchFilter 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' 
            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-indigo-300'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <span className="w-5 inline-block shrink-0" />
          )}

          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
            {node.code}
          </span>

          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate">
              {node.title}
            </h5>
            {node.description && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {node.description}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelectLesson(node)}
          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Play size={10} className="fill-white" /> Watch
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div className="pl-4 border-l border-indigo-200 dark:border-indigo-800 ml-2 space-y-1 my-1">
          {node.children.map(child => (
            <RoadmapTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedMap={expandedMap}
              toggleExpand={toggleExpand}
              onSelectLesson={onSelectLesson}
              searchFilter={searchFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MathsCurriculum({ onEnroll, currentUser }) {
  const studentBoard = currentUser?.board || 'Andhra Pradesh Intermediate';
  const studentYear = currentUser?.year || '1st Year';

  // Board selector: defaults to student's board
  const [selectedBoard, setSelectedBoard] = useState(() => {
    if (studentBoard && /telangana/i.test(studentBoard)) return 'Telangana Intermediate';
    if (studentBoard && /andhra|bieap|ap/i.test(studentBoard)) return 'Andhra Pradesh Intermediate';
    return 'Andhra Pradesh Intermediate';
  });

  // Year selector: defaults to student's year
  const [selectedYear, setSelectedYear] = useState(() => {
    if (studentYear && /2nd|second/i.test(studentYear)) return '2nd Year';
    return '1st Year';
  });

  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const [roadmapModalTopic, setRoadmapModalTopic] = useState(null);
  const [dbVideos, setDbVideos] = useState([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  // Fetch published videos for Mathematics matching board & year
  const loadDbVideos = useCallback(() => {
    setIsLoadingDb(true);
    fetchStudentVideos({
      subject: 'Mathematics',
      board: selectedBoard,
      year: selectedYear,
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbVideos(data);
        }
      })
      .catch((err) => console.warn('Could not load database videos:', err))
      .finally(() => {
        setIsLoadingDb(false);
      });
  }, [selectedBoard, selectedYear]);

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

  // Combine TOPICS_DATA with dbVideos dynamically
  const topicsData = useMemo(() => {
    // Deep clone pre-coded TOPICS_DATA so all nodes have explicit codes (e.g. 1.0, 2.0, 2.1)
    const chapters = JSON.parse(JSON.stringify(TOPICS_DATA));

    const archivedVideos = (dbVideos || []).filter((v) => v.status === 'archived' || v.isArchived);

    if (!dbVideos || dbVideos.length === 0) {
      return chapters.map(assignDynamicCodesToChapter);
    }

    const findChapterForVideo = (v) => {
      const chNum = v.chapterNumber ? Number(v.chapterNumber) : null;
      const rawChName = (v.chapterName || v.chapter || '').trim();

      if (chNum) {
        const byNum = chapters.find((c) => Number(c.number) === chNum);
        if (byNum) return byNum;
      }

      if (rawChName) {
        const cleanName = rawChName.replace(/^Chapter\s*\d+\s*:\s*/i, '').trim().toLowerCase();
        const byName = chapters.find((c) =>
          c.name.toLowerCase() === cleanName ||
          c.name.toLowerCase().includes(cleanName) ||
          cleanName.includes(c.name.toLowerCase()) ||
          (c.chapterTitle && c.chapterTitle.toLowerCase().includes(cleanName))
        );
        if (byName) return byName;
      }

      return null;
    };

    const activeVideos = dbVideos.filter((v) => v.status !== 'archived' && !v.isArchived);

    activeVideos.forEach((v, idx) => {
      const vYtId = v.youtubeId || extractYouTubeId(v.url);

      const parsedKeywords = Array.isArray(v.keywords)
        ? v.keywords
        : typeof v.keywords === 'string'
        ? v.keywords.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(v.tags)
        ? v.tags
        : typeof v.tags === 'string'
        ? v.tags.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // Determine upload level accurately from payload or fallback hints
      let level = v.uploadLevel;
      if (!level) {
        if (v.subSubTopicName?.trim() || ((v.subSubTopicNumber || '').split('.').filter(Boolean).length >= 4)) {
          level = 'subSubTopic';
        } else if (v.subTopicName?.trim() || ((v.subTopicNumber || '').split('.').filter(Boolean).length >= 3)) {
          level = 'subTopic';
        } else if (v.topicName?.trim() || ((v.topicNumber || '').split('.').filter(Boolean).length >= 2)) {
          level = 'topic';
        } else {
          level = 'chapter';
        }
      }

      let matchedChapter = findChapterForVideo(v);
      if (!matchedChapter) {
        const newNum = String(v.chapterNumber || chapters.length + 1);
        const newName = (v.chapterName || v.chapter || `Chapter ${newNum}`)
          .replace(/^Chapter\s*\d+\s*:\s*/i, '')
          .trim();
        matchedChapter = {
          id: `ch-${newNum}-${newName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'chapter'}`,
          number: newNum,
          name: newName,
          chapterTitle: v.chapter ? v.chapter : `${newNum} ${newName}`,
          description: `AP & TS Intermediate Board syllabus lectures for ${newName}.`,
          color: 'from-blue-600 to-indigo-600',
          badgeColor:
            'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          videos: [],
        };
        chapters.push(matchedChapter);
      }

      if (!matchedChapter.videos) {
        matchedChapter.videos = [];
      }

      let safeThumb = v.thumbnailUrl || '';
      let safeYtId = vYtId;
      if (safeThumb.includes('2TzFm9u5e10') || safeYtId === '2TzFm9u5e10') {
        safeThumb = 'https://img.youtube.com/vi/bHIhgxav9LY/hqdefault.jpg';
        safeYtId = 'bHIhgxav9LY';
      }
      if (safeThumb.includes('WUvTyaaNjfo') || safeYtId === 'WUvTyaaNjfo') {
        safeThumb = 'https://img.youtube.com/vi/jQUrfmX0uko/hqdefault.jpg';
        safeYtId = 'jQUrfmX0uko';
      }
      const defaultThumb = safeThumb || (safeYtId ? `https://img.youtube.com/vi/${safeYtId}/hqdefault.jpg` : '');

      if (level === 'subSubTopic') {
        // Hierarchy: Chapter -> Topic -> SubTopic -> SubSubTopic
        const targetTopicCode = String(v.topicNumber || `${matchedChapter.number}.0`).trim();
        const targetTopicName = (v.topicName || '').trim();

        let topicNode = matchedChapter.videos.find((t) =>
          (t.code && t.code === targetTopicCode) ||
          (targetTopicName && t.title && t.title.toLowerCase() === targetTopicName.toLowerCase())
        );

        if (!topicNode) {
          topicNode = {
            id: `topic-${matchedChapter.number}-${targetTopicCode.replace(/\./g, '-')}`,
            code: targetTopicCode,
            title: targetTopicName || `Topic ${targetTopicCode}`,
            description: v.description || `Lectures and concepts for ${targetTopicName || targetTopicCode}`,
            keywords: parsedKeywords,
            isDbUploaded: true,
            children: [],
          };
          matchedChapter.videos.push(topicNode);
        } else {
          // Replace or update existing topic node
          if (targetTopicName) topicNode.title = targetTopicName;
          if (v.description) topicNode.description = v.description;
          topicNode.code = targetTopicCode;
          topicNode.isDbUploaded = true;
          if (parsedKeywords.length) topicNode.keywords = parsedKeywords;
          if (v.url) {
            topicNode.url = v.url;
            topicNode.videoId = vYtId || topicNode.videoId;
            topicNode.thumbnailUrl = defaultThumb || topicNode.thumbnailUrl;
          }
        }

        if (!topicNode.children) topicNode.children = [];

        const targetSubCode = String(v.subTopicNumber || `${topicNode.code}.0`).trim();
        const targetSubName = (v.subTopicName || '').trim();

        let subTopicNode = topicNode.children.find((s) =>
          (s.code && s.code === targetSubCode) ||
          (targetSubName && s.title && s.title.toLowerCase() === targetSubName.toLowerCase())
        );

        if (!subTopicNode) {
          subTopicNode = {
            id: `sub-${targetSubCode.replace(/\./g, '-')}`,
            code: targetSubCode,
            title: targetSubName || `Sub Topic ${targetSubCode}`,
            description: `Study module for ${targetSubName || targetSubCode}`,
            keywords: parsedKeywords,
            isDbUploaded: true,
            children: [],
          };
          topicNode.children.push(subTopicNode);
        }

        if (!subTopicNode.children) subTopicNode.children = [];

        const targetSubSubCode = String(v.subSubTopicNumber || `${subTopicNode.code}.0`).trim();
        const targetSubSubName = (v.subSubTopicName || v.title || '').trim();

        let subSubNode = subTopicNode.children.find((ss) =>
          (ss.code && ss.code === targetSubSubCode) ||
          (targetSubSubName && ss.title && ss.title.toLowerCase() === targetSubSubName.toLowerCase()) ||
          (ss.url && ss.url === v.url) ||
          (ss.videoId && ss.videoId === vYtId)
        );

        if (subSubNode) {
          subSubNode.url = v.url || subSubNode.url;
          subSubNode.videoId = vYtId || subSubNode.videoId;
          subSubNode.thumbnailUrl = defaultThumb || subSubNode.thumbnailUrl;
          subSubNode.title = targetSubSubName || subSubNode.title;
          subSubNode.description = v.description || subSubNode.description;
          subSubNode.isDbUploaded = true;
          if (parsedKeywords.length) subSubNode.keywords = parsedKeywords;
        } else {
          subSubNode = {
            id: v._id ? `db-${v._id}` : `subsub-${targetSubSubCode.replace(/\./g, '-')}-${idx}`,
            code: targetSubSubCode,
            title: targetSubSubName || `Sub Sub Topic ${targetSubSubCode}`,
            description: v.description || `Lecture on ${targetSubSubName || targetSubSubCode}`,
            url: v.url,
            videoId: vYtId,
            thumbnailUrl: defaultThumb,
            keywords: parsedKeywords,
            isDbUploaded: true,
            board: v.board || 'Both Boards',
            year: v.year || '1st Year',
            children: [],
          };
          subTopicNode.children.push(subSubNode);
        }
      } else if (level === 'subTopic') {
        // Hierarchy: Chapter -> Topic -> SubTopic
        const targetTopicCode = String(v.topicNumber || `${matchedChapter.number}.0`).trim();
        const targetTopicName = (v.topicName || '').trim();

        let topicNode = matchedChapter.videos.find((t) =>
          (t.code && t.code === targetTopicCode) ||
          (targetTopicName && t.title && t.title.toLowerCase() === targetTopicName.toLowerCase())
        );

        if (!topicNode) {
          topicNode = {
            id: `topic-${matchedChapter.number}-${targetTopicCode.replace(/\./g, '-')}`,
            code: targetTopicCode,
            title: targetTopicName || `Topic ${targetTopicCode}`,
            description: v.description || `Lectures and concepts for ${targetTopicName || targetTopicCode}`,
            keywords: parsedKeywords,
            isDbUploaded: true,
            children: [],
          };
          matchedChapter.videos.push(topicNode);
        } else {
          if (targetTopicName) topicNode.title = targetTopicName;
          if (v.description) topicNode.description = v.description;
          topicNode.code = targetTopicCode;
          topicNode.isDbUploaded = true;
          if (parsedKeywords.length) topicNode.keywords = parsedKeywords;
          if (v.url) {
            topicNode.url = v.url;
            topicNode.videoId = vYtId || topicNode.videoId;
            topicNode.thumbnailUrl = defaultThumb || topicNode.thumbnailUrl;
          }
        }

        if (!topicNode.children) topicNode.children = [];

        const targetSubCode = String(v.subTopicNumber || `${topicNode.code}.0`).trim();
        const targetSubName = (v.subTopicName || v.title || '').trim();

        let subTopicNode = topicNode.children.find((s) =>
          (s.code && s.code === targetSubCode) ||
          (targetSubName && s.title && s.title.toLowerCase() === targetSubName.toLowerCase()) ||
          (s.url && s.url === v.url) ||
          (s.videoId && s.videoId === vYtId)
        );

        if (subTopicNode) {
          subTopicNode.url = v.url || subTopicNode.url;
          subTopicNode.videoId = vYtId || subTopicNode.videoId;
          subTopicNode.thumbnailUrl = defaultThumb || subTopicNode.thumbnailUrl;
          subTopicNode.title = targetSubName || subTopicNode.title;
          subTopicNode.description = v.description || subTopicNode.description;
          subTopicNode.isDbUploaded = true;
          if (parsedKeywords.length) subTopicNode.keywords = parsedKeywords;
        } else {
          subTopicNode = {
            id: v._id ? `db-${v._id}` : `sub-${targetSubCode.replace(/\./g, '-')}-${idx}`,
            code: targetSubCode,
            title: targetSubName || `Sub Topic ${targetSubCode}`,
            description: v.description || `Module lecture on ${targetSubName || targetSubCode}`,
            url: v.url,
            videoId: vYtId,
            thumbnailUrl: defaultThumb,
            keywords: parsedKeywords,
            isDbUploaded: true,
            board: v.board || 'Both Boards',
            year: v.year || '1st Year',
            children: [],
          };
          topicNode.children.push(subTopicNode);
        }
      } else if (level === 'topic') {
        // Hierarchy: Chapter -> Topic
        const targetTopicCode = String(v.topicNumber || `${matchedChapter.number}.0`).trim();
        const targetTopicName = (v.topicName || v.title || '').trim();

        let topicNode = matchedChapter.videos.find((t) =>
          (t.code && t.code === targetTopicCode) ||
          (targetTopicName && t.title && t.title.toLowerCase() === targetTopicName.toLowerCase()) ||
          (t.url && t.url === v.url) ||
          (t.videoId && t.videoId === vYtId)
        );

        if (topicNode) {
          topicNode.url = v.url || topicNode.url;
          topicNode.videoId = vYtId || topicNode.videoId;
          topicNode.thumbnailUrl = defaultThumb || topicNode.thumbnailUrl;
          topicNode.title = targetTopicName || topicNode.title;
          topicNode.description = v.description || topicNode.description;
          topicNode.code = targetTopicCode;
          topicNode.isDbUploaded = true;
          if (parsedKeywords.length) topicNode.keywords = parsedKeywords;
        } else {
          topicNode = {
            id: v._id ? `db-${v._id}` : `topic-${matchedChapter.number}-${targetTopicCode.replace(/\./g, '-')}-${idx}`,
            code: targetTopicCode,
            title: targetTopicName || `Topic ${targetTopicCode}`,
            description: v.description || `Lectures and concepts for ${targetTopicName || targetTopicCode}`,
            url: v.url,
            videoId: vYtId,
            thumbnailUrl: defaultThumb,
            keywords: parsedKeywords,
            isDbUploaded: true,
            board: v.board || 'Both Boards',
            year: v.year || '1st Year',
            children: [],
          };
          matchedChapter.videos.push(topicNode);
        }
      } else {
        // Chapter level
        const cleanTitle = (v.title || v.chapterName || `Chapter ${matchedChapter.number} Video`).trim();
        const existingVid = matchedChapter.videos.find((vid) =>
          (vid.url && vid.url === v.url) ||
          (vid.videoId && vid.videoId === vYtId) ||
          (vid.title && vid.title.toLowerCase() === cleanTitle.toLowerCase()) ||
          (vid.code && vid.code === `${matchedChapter.number}.0`)
        );

        if (existingVid) {
          existingVid.url = v.url || existingVid.url;
          existingVid.videoId = vYtId || existingVid.videoId;
          existingVid.thumbnailUrl = defaultThumb || existingVid.thumbnailUrl;
          existingVid.title = cleanTitle || existingVid.title;
          existingVid.isDbUploaded = true;
        } else {
          matchedChapter.videos.push({
            id: v._id ? `db-${v._id}` : `ch-vid-${matchedChapter.number}-${idx}`,
            code: `${matchedChapter.number}.${matchedChapter.videos.length}`,
            title: cleanTitle,
            description: v.description || `Overview lecture for Chapter ${matchedChapter.number}`,
            url: v.url,
            videoId: vYtId,
            thumbnailUrl: defaultThumb,
            keywords: parsedKeywords,
            isDbUploaded: true,
            board: v.board || 'Both Boards',
            year: v.year || '1st Year',
            children: [],
          });
        }
      }
    });

    // Clean up replaced or archived videos to prevent duplicate cards
    chapters.forEach((ch) => {
      if (Array.isArray(ch.videos)) {
        ch.videos = ch.videos.filter((vid, vIdx, arr) => {
          // If a DB-uploaded item exists for this exact code, drop un-uploaded placeholder/default
          if (!vid.isDbUploaded) {
            const hasDbReplacement = arr.some((other) => other.isDbUploaded && other.code === vid.code);
            if (hasDbReplacement) return false;
          }
          // If video is archived in DB, drop it from active curriculum
          const isArchived = archivedVideos.some((a) =>
            (a.url && vid.url && a.url === vid.url) ||
            (a.youtubeId && vid.videoId && a.youtubeId === vid.videoId) ||
            (a.title && vid.title && a.title.toLowerCase().trim() === vid.title.toLowerCase().trim()) ||
            (a.code && vid.code && a.code === vid.code && Number(a.chapterNumber) === Number(ch.number) && a.replacedByTitle)
          );
          if (isArchived) return false;
          return true;
        });
      }
    });

    return chapters.map(assignDynamicCodesToChapter);
  }, [dbVideos]);

  // Flatten all merged videos
  const allVideos = useMemo(() => {
    return topicsData.flatMap((topic) =>
      topic.videos.map((video) => ({
        ...video,
        topicId: topic.id,
        topicName: topic.name,
        chapterTitle: topic.chapterTitle || `${topic.number} ${topic.name}`,
        topicNumber: topic.number,
        topicColor: topic.color,
        badgeColor: topic.badgeColor,
      }))
    );
  }, [topicsData]);

  // Search and filter logic supporting recursive nested hierarchy
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
          const codeNorm = normalize(video.code);
          const topicNorm = normalize(video.topicName);
          const keywordsNorm = (video.keywords || []).map((k) => normalize(k));

          const directTitleMatch =
            video.title.toLowerCase().includes(rawLower) || titleNorm.includes(normQ);
          const directCodeMatch =
            video.code.toLowerCase().includes(rawLower) || codeNorm.includes(normQ);
          const directTopicMatch =
            video.topicName.toLowerCase().includes(rawLower) || topicNorm.includes(normQ);

          const matchedKeywords = (video.keywords || []).filter((kw) => {
            const kwNorm = normalize(kw);
            return kw.toLowerCase().includes(rawLower) || kwNorm.includes(normQ);
          });

          const flattenedChildren = flattenNodeTree(video);
          const matchedChild = flattenedChildren.find((node) => {
            const cCodeNorm = normalize(node.code);
            const cTitleNorm = normalize(node.title);
            return (
              node.code.toLowerCase().includes(rawLower) ||
              cCodeNorm.includes(normQ) ||
              node.title.toLowerCase().includes(rawLower) ||
              cTitleNorm.includes(normQ)
            );
          });

          const allTokensInCombined =
            queryTokens.length > 0 &&
            queryTokens.every((token) => {
              const childrenText = flattenedChildren.map((c) => `${c.code} ${c.title}`).join(' ');
              return (
                titleNorm.includes(token) ||
                codeNorm.includes(token) ||
                topicNorm.includes(token) ||
                childrenText.toLowerCase().includes(token) ||
                keywordsNorm.some((kw) => kw.includes(token))
              );
            });

          const isMatch =
            directTitleMatch ||
            directCodeMatch ||
            directTopicMatch ||
            matchedKeywords.length > 0 ||
            allTokensInCombined ||
            Boolean(matchedChild);

          if (isMatch) {
            return {
              ...video,
              matchedKeyword: matchedChild
                ? `Lesson ${matchedChild.code}: ${matchedChild.title}`
                : matchedKeywords[0] || (directTitleMatch ? null : video.keywords && video.keywords[0]),
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

  return (
    <section id="maths-curriculum" className="py-16 sm:py-24 bg-[#EBF0F7] dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold mb-4 border border-indigo-200/60 dark:border-indigo-800/60">
            <Tv size={15} />
            <span>AP & TS Intermediate Mathematics Video Lectures</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Mathematics Chapter-Wise Video Lectures
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg font-medium">
            Explore topic-by-topic concept explanations and theorem proofs for Functions, Mathematical Induction, Matrices, and Vectors with high-yield video solutions.
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
                  These are sample demo videos. <strong>Enroll now</strong> to get full access to detailed all chapters, formula sheets, and live 1-on-1 doubt clearing!
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onEnroll && onEnroll('Mathematics Full Course - All Chapters Access')}
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
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
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {topic.chapterTitle || `${topic.number}. ${topic.name}`} ({topic.videos.length})
                </button>
              );
            })}
          </div>

          {/* Smart Keyword Search Bar */}
          <div className="relative w-full lg:w-96 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or code (e.g. 1.0.0.0.0, Meaning and Notation, Cartesian...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 shadow-xs"
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
          <div className="mb-6 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
              <Search size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>
                Found <strong className="font-bold text-indigo-700 dark:text-indigo-300">{filteredVideos.length}</strong> related {filteredVideos.length === 1 ? 'topic' : 'topics'} for "<em>{searchQuery}</em>"
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
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
              Try searching with general keywords like <strong>PMI</strong>, <strong>Ordered Pairs</strong>, <strong>Cartesian Product</strong>, or <strong>Inverse Functions</strong>.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicId('all'); }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Search & View All ({allVideos.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <MathsVideoCard
                key={video.id}
                video={video}
                isSearching={isSearching}
                onSelectVideo={setActiveVideo}
                onOpenRoadmap={setRoadmapModalTopic}
              />
            ))}
          </div>
        )}

        {/* Bottom Doubt Clearing & Live Tuition CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 border border-indigo-700/30 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Live 1-on-1 Faculty Assistance</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                Need Personal Mentorship or Have Doubts in These Topics?
              </h3>
              <p className="text-indigo-200/80 text-sm sm:text-base max-w-2xl">
                Get 1-on-1 doubt clarification, step-by-step board presentation techniques, and customized chapter worksheets to score a guaranteed 75/75 in Maths.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onEnroll && onEnroll('Maths 1-on-1 Live Doubt & Board Coaching')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                <span>Book 1-on-1 Doubt Session</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Hierarchical Roadmap Modal */}
      {roadmapModalTopic && (
        <HierarchicalRoadmapModal
          chapterTopic={roadmapModalTopic}
          onClose={() => setRoadmapModalTopic(null)}
          onSelectVideo={setActiveVideo}
        />
      )}

      {/* Full Page Lecture Player with Collapsible Hierarchy Syllabus Navigation */}
      {activeVideo && (
        <FullPageLecturePlayer
          initialVideo={activeVideo}
          topicsData={topicsData}
          onClose={() => setActiveVideo(null)}
          onEnroll={onEnroll}
        />
      )}

    </section>
  );
}
