const fs = require("fs")
const path = require("path")

const filePath = path.join(__dirname, "best_buys_questions.txt")
const rawData = fs.readFileSync(filePath, "utf8")
const questions = JSON.parse(rawData)

function modifyQuestions(questions, changes) {
  return questions.map((q, index) => {
    const updated = { ...q }

    if (changes.question_topic) {
      updated.question_topic = changes.question_topic
    }

    if (changes.question_size !== undefined) {
      updated.question_size = changes.question_size
    }

    if (changes.prefix_question_id) {
      const baseId = changes.prefix_question_id
      updated.question_id = `${baseId}${index + 1}`
    }

    return updated
  })
}

const updatedQuestions = modifyQuestions(questions, {
  question_topic: "Best Buy Questions",
  prefix_question_id: "3.13.",
})

const outputPath = path.join(__dirname, "updated_questions.txt")
fs.writeFileSync(outputPath, JSON.stringify(updatedQuestions, null, 2))
console.log("✅ Updated questions saved.")
