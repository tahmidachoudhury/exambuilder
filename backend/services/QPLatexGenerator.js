const fs = require("fs")
const path = require("path")

//This function formats the questions consistently using latex
function formatQuestion(questionNumber, questionContent, totalMarks) {
  return `
%question ${questionNumber}

\\textbf{${questionNumber}} \\hspace{1em}
${questionContent}

\\hfill \\textbf{(Total for question ${questionNumber} is ${totalMarks} marks)}

\\hrule height 0.1pt
\\vspace{1em}
`
}

//calculates the total mark of the paper
function getTotalMarks(questions) {
  let total = 0
  questions.forEach((question) => {
    total += question.total_marks
  })
  return total
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

  //console.log("successfully formatted questions", questionsContent)

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

//paper now makes full pages by organising questions based on question size
function groupQuestionsIntoFullPages(questions, formattedQuestions) {
  const pages = []
  let currentPage = []
  let currentTotal = 0

  for (let i = 0; i < questions.length; i++) {
    const size = questions[i].question_size
    // console.log(`Question ${i + 1} is ${size}!`)

    // If the question is full page or more
    if (questions[i].full_page) {
      //this makes sure any incomplete pages are pushed forward to "pages", and the full_page questions dont jump the queue
      if (currentPage.length > 0) {
        pages.push(currentPage.join("\n\n"))
        currentPage = []
        currentTotal = 0
      }
      // Full page question goes alone
      pages.push(formattedQuestions[i])
      // console.log(`Question ${i + 1} is a full page question!`)
      continue
    }

    // If it fits in the current page
    if (currentTotal + size <= 1) {
      currentPage.push(formattedQuestions[i])
      currentTotal += size
      // console.log(`added question ${i + 1}. Page size: ${currentTotal}`)
    } else {
      // Current page is full, start a new one
      pages.push(currentPage.join("\n\n"))
      currentPage = [formattedQuestions[i]]
      currentTotal = size
      // console.log(`Started a new page!`)
    }
  }

  // Push remaining questions as a final page
  if (currentPage.length > 0) {
    pages.push(currentPage.join("\n\n"))
  }

  return pages
}

function createPages(questionPairs) {
  const finalExam = questionPairs
    .map((questionsInPairs) => {
      return formatPage(questionsInPairs)
    })
    .join("\n")
  // console.log(
  //   "successfully created exam pages",
  //   String(finalExam).slice(0, 700)
  // )
  return finalExam
}

function generateExam(questions) {
  // console.log(questions)
  const totalMarksinExam = getTotalMarks(questions)

  //console.log(singlePageQuestions)

  const formattedQuestions = createQuestions(questions)

  console.log(`Formatted ${formattedQuestions.length} questions`)

  // const questionPairs = groupQuestionsIntoPairs(
  //   formattedQuestions,
  //   singlePageQuestions
  // )

  const questionPages = groupQuestionsIntoFullPages(
    questions,
    formattedQuestions
  )

  // console.log(`Created ${questionPairs.length} question pages`)
  console.log(`Created ${questionPages.length} question pages`)

  try {
    // Read the template
    const templatePath = path.join(__dirname, "../templates/exam-template.tex")
    let template = fs.readFileSync(templatePath, "utf8")

    // Generate all pages with 2 questions per page
    // const finalExam = createPages(questionPairs)
    const finalExam = createPages(questionPages)

    // Replace the placeholder with actual questions
    const finalLatex = template
      .replace("%PAGES_PLACEHOLDER", finalExam)
      .replaceAll("@@TOTAL@@", totalMarksinExam)

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
