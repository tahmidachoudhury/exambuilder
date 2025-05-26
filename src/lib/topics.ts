export interface TopicCategory {
  id: number
  name: string
  topics: TopicMetaData[]
}

export interface TopicMetaData {
  topic: string
  url: string
}

export const topics: TopicCategory[] = [
  {
    id: 1,
    name: "Number",
    topics: [
      {
        topic: "Addition and Subtraction",
        url: "addition-and-subtraction.php",
      },
      {
        topic: "Multiplication and Division",
        url: "multiplication-and-division.php",
      },
      { topic: "Time", url: "time.php" },
      { topic: "Metric Conversions", url: "metric-conversions.php" },
      { topic: "Place Value", url: "place-value.php" },
      { topic: "Rounding", url: "rounding.php" },
      { topic: "Negative Numbers", url: "negativenumbers.php" },
      { topic: "Powers and Roots", url: "squares-cubes-and-roots.php" },
      {
        topic: "Writing, Simplifying and Ordering Fractions",
        url: "writing-fractions.php",
      },
      {
        topic: "Factors, Multiples and Primes",
        url: "factors-multiples-and-primes.php",
      },
      { topic: "Fractions", url: "fractions.php" },
      { topic: "Fractions of an Amount", url: "fraction-of-amount.php" },
      { topic: "Fractions, Decimals and Percentages", url: "FDP.php" },
      { topic: "Estimation", url: "estimating.php" },
      { topic: "Percentages", url: "percentages.php" },
      { topic: "Percentage Change", url: "percentage-change.php" },
      { topic: "Reverse Percentages", url: "reverse-percentages.php" },
      {
        topic: "Repeated Percentage Change",
        url: "repeated-percentage-change.php",
      },
      { topic: "Error Intervals", url: "error-intervals.php" },
      { topic: "Exchange Rates", url: "exchange-rates.php" },
      { topic: "Conversions and Units", url: "conversions-and-units.php" },
      { topic: "Best Buys", url: "best-buys.php" },
      { topic: "Standard Form", url: "standard-form.php" },
      {
        topic: "Compound Interest and Depreciation",
        url: "compound-interest.php",
      },
      { topic: "Surds", url: "surds.php" },
      { topic: "Indices", url: "indices.php" },
      { topic: "Fractional and Negative Indices", url: "indices2.php" },
      { topic: "Bounds", url: "bounds.php" },
      {
        topic: "Converting Recurring Decimals to Fractions",
        url: "recurring.php",
      },
      { topic: "Compound Measures", url: "speed-and-density.php" },
    ],
  },
  {
    id: 2,
    name: "Algebra",
    topics: [
      { topic: "Simplifying Algebra", url: "simplifyingalgebra.php" },
      { topic: "Writing an Expression", url: "writing-an-expression.php" },
      { topic: "Substitution", url: "substitution.php" },
      { topic: "Function Machines", url: "function-machines.php" },
      {
        topic: "Solving One Step Equations",
        url: "solving-one-step-equations.php",
      },
      { topic: "Solving Equations", url: "solving-equations.php" },
      { topic: "Solving Quadratics", url: "solving-quadratics.php" },
      {
        topic: "Solving Simultaneous Equations Graphically",
        url: "simultaneous-graphically.php",
      },
      { topic: "Simultaneous Equations", url: "simultaneous.php" },
      { topic: "Expand and Factorise", url: "expanding-and-factorising.php" },
      {
        topic: "Expanding and Factorising Quadratics",
        url: "expanding-and-factorising-quadratics.php",
      },
      {
        topic: "Expanding Triple Brackets",
        url: "expanding-triple-brackets.php",
      },
      { topic: "Factorising Harder Quadratics", url: "factorising-harder.php" },
      { topic: "Algebraic Fractions", url: "algebraic-fractions.php" },
      {
        topic: "Changing the Subject of a Formula",
        url: "changing-the-subject1.php",
      },
      {
        topic: "Rearranging Harder Formulae",
        url: "changing-the-subject2.php",
      },
      { topic: "Quadratic Graphs", url: "quadratic-graphs.php" },
      { topic: "Cubic/Reciprocal Graphs", url: "cubic-reciprocal.php" },
      { topic: "Gradient of a Line", url: "gradient-of-a-line.php" },
      { topic: "Equation of a Line", url: "equation-of-a-line.php" },
      {
        topic: "Parallel and Perpendicular Lines",
        url: "parallel-and-perpendicular-lines.php",
      },
      { topic: "Inequalities", url: "inequalities.php" },
      { topic: "Inequalities on Graphs", url: "inequalities-on-graphs.php" },
      { topic: "Sequences (Nth Term)", url: "sequences.php" },
      { topic: "Quadratic Sequences", url: "quadratic-nth-term.php" },
      { topic: "Completing the Square", url: "completing-the-square.php" },
      { topic: "Quadratic Inequalities", url: "quadratic-inequalities.php" },
      {
        topic: "Forming and Solving Equations",
        url: "forming-and-solving-equations.php",
      },
      { topic: "Proof", url: "proof.php" },
      {
        topic: "The Product Rule for Counting",
        url: "product-rule-for-counting.php",
      },
      { topic: "Iteration", url: "iteration.php" },
      { topic: "Inverse and Composite Functions", url: "functions.php" },
      { topic: "Transforming Graphs y=f(x)", url: "transforming-graphs.php" },
      { topic: "Quadratic Formula", url: "quadratic-formula.php" },
    ],
  },
  {
    id: 3,
    name: "Ratio, Proportion and Rates of Change",
    topics: [
      { topic: "Writing and Simplifying Ratio", url: "writing-fractions.php" },
      { topic: "Sharing Ratio", url: "ratio.php" },
      {
        topic: "Ratio Fraction Problems",
        url: "ratio-fraction-or-linear-function.php",
      },
      {
        topic: "Ratio Problems 2",
        url: "ratio-fraction-or-linear-function.php",
      },
      { topic: "Recipe Proportions", url: "recipe-questions.php" },
      { topic: "Direct and Inverse Proportion", url: "proportion.php" },
      { topic: "Scale Drawings", url: "scale-drawing.php" },
      {
        topic: "Speed/Distance/Time (under Compound Measures)",
        url: "speed-and-density.php",
      },
      { topic: "Real Life and Distance Time Graphs", url: "real-graphs.php" },
      { topic: "Similar Shapes (Lengths)", url: "similar-shapes-length.php" },
      {
        topic: "Similar Shapes (Area and Volume)",
        url: "similar-shapes-area-volume.php",
      },
      {
        topic: "Enlarging with Negative Scale Factors",
        url: "negative-enlargement.php",
      },
      { topic: "Best Buy Questions", url: "best-buys.php" },
    ],
  },
  {
    id: 4,
    name: "Geometry and Measures",
    topics: [
      { topic: "Angles", url: "angles.php" },
      { topic: "Angles in Parallel Lines", url: "angles-parallel.php" },
      { topic: "Angles in Polygons", url: "angles-polygons.php" },
      { topic: "Area and Perimeter", url: "area-perimeter.php" },
      { topic: "Area of Compound Shapes", url: "compound-shapes.php" },
      { topic: "Surface Area", url: "surfacearea.php" },
      { topic: "Volume of a Prism", url: "volume.php" },
      { topic: "Volume and Surface Area of Cylinders", url: "cylinders.php" },
      { topic: "Spheres and Cones", url: "spheresandcones.php" },
      { topic: "Sectors and Arcs", url: "sectors-and-arcs.php" },
      {
        topic: "Finding the Area of Any Triangle",
        url: "area-of-any-triangle.php",
      },
      { topic: "The Sine Rule", url: "sine-rule.php" },
      { topic: "The Cosine Rule", url: "cosine-rule.php" },
      { topic: "Pythagoras", url: "pythagoras.php" },
      { topic: "3d Pythagoras and Trigonometry", url: "3d-pythagoras.php" },
      { topic: "SOHCAHTOA (Trigonometry)", url: "sohcahtoa.php" },
      { topic: "Exact trig values", url: "exact-trig-values.php" },
      { topic: "Congruent Triangles", url: "congruence.php" },
      { topic: "Coordinates", url: "coordinates.php" },
      { topic: "Drawing Linear Graphs", url: "lineargraphs.php" },
      { topic: "Rotations", url: "transformations.php" },
      { topic: "Reflections", url: "transformations.php" },
      { topic: "Enlargements", url: "transformations.php" },
      { topic: "Translations", url: "transformations.php" },
      { topic: "Mixed Transformations", url: "transformations.php" },
      { topic: "Loci and Construction", url: "loci-and-construction.php" },
      { topic: "Bearings", url: "bearings.php" },
      { topic: "Plans and Elevations", url: "plans-and-elevations.php" },
      { topic: "Circle Theorems", url: "circle-theorems.php" },
      {
        topic: "Proof of the Circle Theorems",
        url: "proof-of-circle-theorems.php",
      },
      {
        topic: "Parallel and Perpendicular Lines",
        url: "parallel-and-perpendicular-lines.php",
      },
      { topic: "Vectors", url: "column-vectors.php" },
      { topic: "Vectors Proof", url: "vectors.php" },
    ],
  },
  {
    id: 5,
    name: "Statistics",
    topics: [
      { topic: "Pictograms", url: "pictograms.php" },
      { topic: "Bar Charts", url: "bar-charts.php" },
      { topic: "Pie Charts", url: "pie-charts.php" },
      { topic: "Stem and Leaf", url: "stem-and-leaf.php" },
      { topic: "Frequency Trees", url: "frequency-trees.php" },
      { topic: "Two Way Tables", url: "two-way-tables.php" },
      { topic: "Frequency Polygons", url: "frequency-polygons.php" },
      { topic: "Mean, Median, Mode and Range", url: "averages.php" },
      { topic: "Averages from Frequency Tables", url: "mean-tables.php" },
      { topic: "Scatter Graphs", url: "scatter-graphs.php" },
      { topic: "Cumulative Frequency", url: "cumulative.php" },
      { topic: "Box Plots", url: "box-plots.php" },
      { topic: "Histograms", url: "histograms.php" },
    ],
  },
  {
    id: 6,
    name: "Probability",
    topics: [
      { topic: "Probability", url: "probability.php" },
      {
        topic: "Relative Frequency (within Probability)",
        url: "probability2.php",
      },
      { topic: "Probability Trees", url: "probability-trees.php" },
      { topic: "Venn Diagrams", url: "venn-diagrams.php" },
      { topic: "Conditional Probability", url: "conditional.php" },
      {
        topic: "Probability Equation Questions",
        url: "probability-equation-questions.php",
      },
    ],
  },
]
