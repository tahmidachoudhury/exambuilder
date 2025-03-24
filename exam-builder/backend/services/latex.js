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
    return formatQuestion(index + 1, question.content, question.total_marks)
  })

  // console.log("successfully formatted questions", questionsContent)

  return questionsContent
}

function getSinglePageQuestions(questions) {
  const singlePageQuestions = []

  questions.forEach((question, index) => {
    if (question.full_page) {
      console.log("Question", index + 1, "is single!")
      singlePageQuestions.push(index)
    }
  })

  return singlePageQuestions
}

//formats the questions into pairs
function groupQuestionsIntoPairs(formattedQuestions, singlePageQuestions) {
  const pairs = []
  let i = 0

  while (i < formattedQuestions.length) {
    //if current q should remain single
    if (singlePageQuestions.includes(i)) {
      pairs.push(formattedQuestions[i])
      i++
    }
    // If theres a next question and it should NOT remain single
    else if (
      i + 1 < formattedQuestions.length &&
      !singlePageQuestions.includes(i + 1)
    ) {
      pairs.push(formattedQuestions[i] + "\n\n" + formattedQuestions[i + 1])
      i += 2
    }
    // If theres an odd number of questions, the last one goes alone
    else {
      pairs.push(formattedQuestions[i])
      i++
    }
  }

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
  const singlePageQuestions = getSinglePageQuestions(questions)

  console.log(singlePageQuestions)

  const formattedQuestions = createQuestions(questions)

  console.log(`Formatted ${formattedQuestions.length} questions`)

  const questionPairs = groupQuestionsIntoPairs(
    formattedQuestions,
    singlePageQuestions
  )

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
