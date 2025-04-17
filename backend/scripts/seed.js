const admin = require("firebase-admin")
const serviceAccount = require("./firebase-key.json")
const questions = require("../data/questions.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Upload each question to Firestore
async function seedQuestions() {
  const batch = db.batch() // Use batch for efficiency

  questions.questions.forEach((q) => {
    const docRef = db.collection("questions").doc(q.question_id)
    batch.set(docRef, {
      ...q,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  })

  await batch.commit()
  console.log("✅ All questions seeded to Firestore!")
}

seedQuestions().catch((err) => {
  console.error("❌ Failed to seed:", err)
})
