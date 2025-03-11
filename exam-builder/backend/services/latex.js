const fs = require("fs")
const path = require("path")

function formatQuestion(questionNumber, questionContent, totalMarks) {
  return `
%question ${questionNumber}

\\textbf{${questionNumber}} \\hspace{1em} 
${questionContent}

\\hfill \\textbf{(Total for question ${questionNumber} is ${totalMarks} marks)}

\\hrule height 0.4pt
\\vspace{1em}
`
}

function generateExam(questions) {
  try {
    // Read the template
    const templatePath = path.join(__dirname, "../templates/exam-template.tex")
    let template = fs.readFileSync(templatePath, "utf8")

    // Generate all questions content
    const questionsContent = questions
      .map((question, index) => {
        return formatQuestion(index + 1, question.content, question.totalMarks)
      })
      .join("\n")

    // Replace the placeholder with actual questions
    const finalLatex = template.replace(
      "%QUESTIONS_PLACEHOLDER%",
      questionsContent
    )

    return finalLatex
  } catch (error) {
    console.error("Error generating LaTeX:", error)
    throw error
  }
}

// Example usage:
const exampleQuestion = {
  content: `\\[f(x) = (x + 3)(x + 2)(x - 1)\\] 

\\begin{enumerate}[label=(\\alph*)]
\\item Sketch the curve \\( y = f(x) \\), showing the points of intersection with the coordinate axes. \\hfill \\textbf{(3)}
\\item Showing the coordinates of the points of intersection with the coordinate axes, sketch on separate diagrams the curves:
    \\begin{enumerate}[label=(\\roman*)]
    \\item \\( y = f(x - 3) \\) \\hfill \\textbf{(2)}
    \\item \\( y = f(-x) \\) \\hfill \\textbf{(2)}
    \\end{enumerate}
\\end{enumerate}

\\vspace{8cm}`,
  totalMarks: 7,
}

module.exports = {
  generateExam,
  formatQuestion,
}
