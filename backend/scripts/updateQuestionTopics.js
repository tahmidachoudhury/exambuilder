const admin = require("firebase-admin")
const serviceAccount = require("./firebase-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function updateQuestionTopics() {
  const questionsRef = db.collection("questions")

  // Query for questions with IDs from 1.17.1 to 1.17.20
  // Using a regex pattern or startsWith/endsWith won't work well with Firestore
  // Instead, we'll do a full query and filter in-memory
  const snapshot = await questionsRef.get()

  const batch = db.batch()
  let count = 0

  snapshot.forEach((doc) => {
    const questionId = doc.id

    // Check if the question ID matches our pattern (1.17.1 through 1.17.20)
    if (questionId.startsWith("2.1.")) {
      // Update to the correct topic
      const docRef = questionsRef.doc(questionId)
      batch.update(docRef, { topic: "Algebra" })
      count++
    }
  })

  if (count > 0) {
    await batch.commit()
    console.log(
      `✅ Updated ${count} questions with topic "Reverse Percentages"`
    )
  } else {
    console.log("No matching questions found to update.")
  }
}

updateQuestionTopics().catch(console.error)
