const OpenAI = require("openai")
const dotenv = require("dotenv")
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateQuestions(payload) {
  const { numberOfQuestions, difficultyLevel, topics, answerSheet } =
    payload.values

  const prompt = `
Generate ${numberOfQuestions} ${difficultyLevel} level questions, with${
    answerSheet ? "" : "out"
  } a list of answers seperately, on the topic(s): ${topics.join(
    ", "
  )}. Make sure the output is a JSON object with the following format: {questions: [{id: number, text: string, math: string}], answers: [{id: number, math: string}]}. Make sure the questions are strictly for GCSE Maths curriculum in the UK. Do not include pleasantries, backticks or any other text. Do not give any help or hints such as equations.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  return response.choices[0].message.content
}

module.exports = { generateQuestions }
