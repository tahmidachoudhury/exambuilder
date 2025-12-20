export interface TopicItem {
  topic: string;
  url: string;
}

export interface TopicCategory {
  id: number;
  name: string;
  topics: TopicItem[];
}

export const topicCategories: TopicCategory[] = [
  {
    id: 1,
    name: "Number",
    topics: [
      { topic: "Addition and Subtraction", url: "addition-and-subtraction.php" },
      { topic: "Multiplication and Division", url: "multiplication-and-division.php" },
      { topic: "Fractions", url: "fractions.php" },
      { topic: "Decimals", url: "decimals.php" },
      { topic: "Percentages", url: "percentages.php" },
      { topic: "Ratio and Proportion", url: "ratio-and-proportion.php" },
      { topic: "Powers and Roots", url: "powers-and-roots.php" },
      { topic: "Standard Form", url: "standard-form.php" },
      { topic: "Surds", url: "surds.php" },
      { topic: "Bounds", url: "bounds.php" },
    ],
  },
  {
    id: 2,
    name: "Algebra",
    topics: [
      { topic: "Simplifying Expressions", url: "simplifying-expressions.php" },
      { topic: "Expanding Brackets", url: "expanding-brackets.php" },
      { topic: "Factorising", url: "factorising.php" },
      { topic: "Solving Linear Equations", url: "solving-linear-equations.php" },
      { topic: "Solving Quadratic Equations", url: "solving-quadratic-equations.php" },
      { topic: "Simultaneous Equations", url: "simultaneous-equations.php" },
      { topic: "Inequalities", url: "inequalities.php" },
      { topic: "Sequences", url: "sequences.php" },
      { topic: "Functions", url: "functions.php" },
      { topic: "Algebraic Fractions", url: "algebraic-fractions.php" },
    ],
  },
  {
    id: 3,
    name: "Geometry",
    topics: [
      { topic: "Angles", url: "angles.php" },
      { topic: "Polygons", url: "polygons.php" },
      { topic: "Circles", url: "circles.php" },
      { topic: "Transformations", url: "transformations.php" },
      { topic: "Congruence and Similarity", url: "congruence-and-similarity.php" },
      { topic: "Pythagoras Theorem", url: "pythagoras-theorem.php" },
      { topic: "Trigonometry", url: "trigonometry.php" },
      { topic: "Vectors", url: "vectors.php" },
      { topic: "Circle Theorems", url: "circle-theorems.php" },
    ],
  },
  {
    id: 4,
    name: "Statistics",
    topics: [
      { topic: "Averages", url: "averages.php" },
      { topic: "Representing Data", url: "representing-data.php" },
      { topic: "Scatter Graphs", url: "scatter-graphs.php" },
      { topic: "Cumulative Frequency", url: "cumulative-frequency.php" },
      { topic: "Histograms", url: "histograms.php" },
      { topic: "Box Plots", url: "box-plots.php" },
    ],
  },
  {
    id: 5,
    name: "Probability",
    topics: [
      { topic: "Basic Probability", url: "basic-probability.php" },
      { topic: "Probability Trees", url: "probability-trees.php" },
      { topic: "Venn Diagrams", url: "venn-diagrams.php" },
      { topic: "Conditional Probability", url: "conditional-probability.php" },
    ],
  },
  {
    id: 6,
    name: "Ratio & Proportion",
    topics: [
      { topic: "Direct Proportion", url: "direct-proportion.php" },
      { topic: "Inverse Proportion", url: "inverse-proportion.php" },
      { topic: "Compound Measures", url: "compound-measures.php" },
      { topic: "Growth and Decay", url: "growth-and-decay.php" },
    ],
  },
];
