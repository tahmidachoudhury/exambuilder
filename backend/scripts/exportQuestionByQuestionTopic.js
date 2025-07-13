const admin = require("firebase-admin")
const fs = require("fs")
const serviceAccount = require("./firebase-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

questionTopic = "Translations"
fileName = "translations.txt"

const db = admin.firestore()

async function exportQuestions() {
  const questionsRef = db.collection("questions")
  const snapshot = await questionsRef
    .where("question_topic", "==", `${questionTopic}`)
    .get()

  if (snapshot.empty) {
    console.log(`No ${questionTopic} questions found.`)
    return
  }

  const questions = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    // You can remove the question_id if you want, but here we just exclude the prefix ID from the file output
    questions.push(data)
  })

  const fileContent = JSON.stringify(questions, null, 2)

  fs.writeFileSync(`${fileName}`, fileContent)

  console.log(`✅ Exported ${questions.length} questions to ${fileName}`)
}

exportQuestions().catch(console.error)
