const admin = require("firebase-admin")
const serviceAccount = require("./firebase-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function addQuestionSizeToAllQuestions() {
  const questionsRef = db.collection("questions")
  const snapshot = await questionsRef.get()

  const batch = db.batch()
  let count = 0

  snapshot.forEach((doc) => {
    const data = doc.data()

    // Skip if already has question_size
    if (data.question_size !== undefined) return

    if (data.full_page) {
      const questionSize = 1
    }

    // You can customize how you calculate size. For now, set default.
    const questionSize = 0.25

    const docRef = questionsRef.doc(doc.id)
    batch.update(docRef, { question_size: questionSize })
    count++
  })

  await batch.commit()
  console.log(`✅ Updated ${count} questions with question_size`)
}

addQuestionSizeToAllQuestions().catch(console.error)
