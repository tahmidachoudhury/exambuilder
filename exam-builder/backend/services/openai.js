const OpenAI = require("openai")
const dotenv = require("dotenv")
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateQuestions(payload) {
  const { numberOfQuestions, difficultyLevel, topics } = payload.values

  const prompt = `
Generate ${numberOfQuestions} ${difficultyLevel} level questions on the topic(s): ${topics.join(
    ", "
  )}. Make sure they are strictly for GCSE Maths curriculum in the UK. Do not include pleasantries or any other text.`

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
