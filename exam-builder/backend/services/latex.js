const fs = require("fs")
const path = require("path")

//This function formats the questions consistently using latex
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

//This function formats the pages consistently using latex
function formatPage(questionPair) {
  return `
\\begin{tcolorbox}
[width=\\textwidth, height=\\textheight, colframe=black, colback=white, arc=5mm, boxrule=0.2mm]

${questionPair}


\\end{tcolorbox} % Close the bordered box
`
}

//Questions comes from server
function createQuestions(questions) {
  const questionsContent = questions.map((question, index) => {
    return formatQuestion(index + 1, question.content, question.totalMarks)
  })

  // console.log("successfully formatted questions", questionsContent)

  return questionsContent
}

//formats the questions into pairs
const groupQuestionsIntoPairs = (formattedQuestions) => {
  const pairs = []
  for (let i = 0; i < formattedQuestions.length; i += 2) {
    if (i + 1 < formattedQuestions.length) {
      // If we have two questions, pair them
      pairs.push(formattedQuestions[i] + "\n\n" + formattedQuestions[i + 1])
    } else {
      // If we have an odd number of questions, the last one goes alone
      pairs.push(formattedQuestions[i])
    }
  }
  // console.log("successfully paired questions", pairs)
  return pairs
}

function createPages(questionPair) {
  const finalExam = questionPair
    .map((question) => {
      return formatPage(question)
    })
    .join("\n")
  // console.log(
  //   "successfully created exam pages",
  //   String(finalExam).slice(0, 700)
  // )
  return finalExam
}

function generateExam(questions) {
  const formattedQuestions = createQuestions(questions)

  console.log(`Formatted ${formattedQuestions.length} questions`)

  const questionPairs = groupQuestionsIntoPairs(formattedQuestions)

  console.log(`Created ${questionPairs.length} pages`)

  try {
    // Read the template
    const templatePath = path.join(__dirname, "../templates/exam-template.tex")
    let template = fs.readFileSync(templatePath, "utf8")

    // Generate all pages with 2 questions per page
    const finalExam = createPages(questionPairs)

    // Replace the placeholder with actual questions
    const finalLatex = template.replace("%PAGES_PLACEHOLDER", finalExam)

    return finalLatex
  } catch (error) {
    console.error("Error generating LaTeX:", error)
    throw error
  }
}

module.exports = {
  generateExam,
  formatQuestion,
}
