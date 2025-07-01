const admin = require("firebase-admin")
const fs = require("fs")
const serviceAccount = require("./firebase-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function exportBestBuysQuestions() {
  const questionsRef = db.collection("questions")
  const snapshot = await questionsRef
    .where("question_topic", "==", "Best Buys")
    .get()

  if (snapshot.empty) {
    console.log("No 'Best Buys' questions found.")
    return
  }

  const questions = []

  snapshot.forEach((doc) => {
    const data = doc.data()
    // You can remove the question_id if you want, but here we just exclude the prefix ID from the file output
    questions.push(data)
  })

  const fileContent = JSON.stringify(questions, null, 2)

  fs.writeFileSync("best_buys_questions.txt", fileContent)

  console.log(
    `✅ Exported ${questions.length} questions to best_buys_questions.txt`
  )
}

exportBestBuysQuestions().catch(console.error)
