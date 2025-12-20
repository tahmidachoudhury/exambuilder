import { Topic, TopicCategory, Question } from '@/types/exam';

export const topicCategories: TopicCategory[] = [
  {
    name: 'Number',
    topics: [
      { id: 'fractions', name: 'Fractions', category: 'Number', questionCount: 24 },
      { id: 'decimals', name: 'Decimals', category: 'Number', questionCount: 18 },
      { id: 'percentages', name: 'Percentages', category: 'Number', questionCount: 22 },
      { id: 'ratio', name: 'Ratio & Proportion', category: 'Number', questionCount: 16 },
      { id: 'indices', name: 'Indices & Powers', category: 'Number', questionCount: 20 },
      { id: 'standard-form', name: 'Standard Form', category: 'Number', questionCount: 12 },
    ],
  },
  {
    name: 'Algebra',
    topics: [
      { id: 'expressions', name: 'Expressions', category: 'Algebra', questionCount: 28 },
      { id: 'equations', name: 'Linear Equations', category: 'Algebra', questionCount: 32 },
      { id: 'quadratics', name: 'Quadratic Equations', category: 'Algebra', questionCount: 26 },
      { id: 'sequences', name: 'Sequences', category: 'Algebra', questionCount: 18 },
      { id: 'graphs', name: 'Graphs', category: 'Algebra', questionCount: 24 },
      { id: 'inequalities', name: 'Inequalities', category: 'Algebra', questionCount: 14 },
    ],
  },
  {
    name: 'Geometry',
    topics: [
      { id: 'angles', name: 'Angles', category: 'Geometry', questionCount: 22 },
      { id: 'shapes', name: 'Properties of Shapes', category: 'Geometry', questionCount: 20 },
      { id: 'area-perimeter', name: 'Area & Perimeter', category: 'Geometry', questionCount: 26 },
      { id: 'volume', name: 'Volume', category: 'Geometry', questionCount: 18 },
      { id: 'transformations', name: 'Transformations', category: 'Geometry', questionCount: 16 },
      { id: 'pythagoras', name: 'Pythagoras', category: 'Geometry', questionCount: 14 },
      { id: 'trigonometry', name: 'Trigonometry', category: 'Geometry', questionCount: 22 },
    ],
  },
  {
    name: 'Statistics',
    topics: [
      { id: 'averages', name: 'Averages', category: 'Statistics', questionCount: 20 },
      { id: 'charts', name: 'Charts & Diagrams', category: 'Statistics', questionCount: 16 },
      { id: 'probability', name: 'Probability', category: 'Statistics', questionCount: 24 },
      { id: 'sampling', name: 'Sampling', category: 'Statistics', questionCount: 10 },
    ],
  },
];

const difficulties: Question['difficulty'][] = ['Grade 1-3', 'Grade 4-5', 'Grade 6-7', 'Grade 8-9'];
const types: Question['type'][] = ['calculator', 'non-calculator'];

const questionTemplates: Record<string, string[]> = {
  fractions: [
    'Simplify the fraction \\frac{24}{36}',
    'Calculate \\frac{2}{3} + \\frac{3}{4}',
    'Work out \\frac{5}{6} \\times \\frac{3}{10}',
    'Divide \\frac{7}{8} by \\frac{1}{4}',
    'Convert \\frac{17}{5} to a mixed number',
  ],
  decimals: [
    'Calculate 3.45 × 2.6',
    'Divide 15.75 by 0.25',
    'Round 3.4567 to 2 decimal places',
    'Order these decimals: 0.35, 0.305, 0.355, 0.3',
    'Convert 0.375 to a fraction in simplest form',
  ],
  percentages: [
    'Calculate 15% of £240',
    'Increase £80 by 12.5%',
    'A price decreases from £50 to £42. Find the percentage decrease.',
    'Express 45 as a percentage of 180',
    'Calculate the original price if £66 is 120% of it',
  ],
  equations: [
    'Solve 3x + 7 = 22',
    'Solve 5(2x - 3) = 4x + 9',
    'Solve \\frac{x + 3}{4} = 5',
    'Solve 2(3x + 1) - 4(x - 2) = 14',
    'Find the value of x: 7x - 3 = 2x + 12',
  ],
  quadratics: [
    'Solve x² - 5x + 6 = 0 by factorisation',
    'Use the quadratic formula to solve 2x² + 3x - 5 = 0',
    'Complete the square for x² + 6x + 2',
    'Solve x² - 9 = 0',
    'Find the roots of x² + 4x - 21 = 0',
  ],
  angles: [
    'Calculate the missing angle in a triangle with angles 47° and 68°',
    'Find angle x where two parallel lines are cut by a transversal',
    'Calculate the interior angle of a regular hexagon',
    'Find the exterior angle of a regular pentagon',
    'Prove that angles in a quadrilateral sum to 360°',
  ],
  'area-perimeter': [
    'Calculate the area of a trapezium with parallel sides 8cm and 12cm, height 5cm',
    'Find the circumference of a circle with radius 7cm. Give your answer in terms of π',
    'Calculate the area of a sector with radius 10cm and angle 72°',
    'Find the perimeter of a semicircle with diameter 14cm',
    'Calculate the area of a compound shape made of a rectangle and triangle',
  ],
  probability: [
    'A bag contains 4 red, 3 blue, and 5 green balls. Find P(red)',
    'Calculate the probability of rolling a prime number on a fair dice',
    'Two fair coins are flipped. Find P(at least one head)',
    'A card is drawn from a standard deck. Find P(heart or face card)',
    'Calculate the probability of drawing two aces without replacement',
  ],
  default: [
    'Solve the following problem and show your working',
    'Calculate the answer to 3 significant figures',
    'Find the value of x in the given equation',
    'Work out the following, giving your answer in simplest form',
    'Prove the given statement algebraically',
  ],
};

export const generateQuestionsForTopic = (topicId: string): Question[] => {
  const topic = topicCategories
    .flatMap((cat) => cat.topics)
    .find((t) => t.id === topicId);

  if (!topic) return [];

  const templates = questionTemplates[topicId] || questionTemplates.default;

  return templates.map((content, index) => ({
    id: `${topicId}-q${index + 1}`,
    question_id: `Q${String(index + 1).padStart(3, '0')}`,
    topic: topic.name,
    question_topic: topic.name,
    difficulty: difficulties[index % difficulties.length],
    type: types[index % types.length],
    content,
    answer: 'Answer will be provided',
    model_answer: 'Step-by-step solution will be provided',
    total_marks: [2, 3, 4, 5, 6][index % 5],
    full_page: index === 4,
    question_size: 1,
    ms_size: 1,
    ma_size: 2,
  }));
};

export const allTopics: Topic[] = topicCategories.flatMap((cat) => cat.topics);
