import { NextRequest, NextResponse } from "next/server"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccountJSON = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64!,
  "base64"
).toString("utf8")

const serviceAccount = JSON.parse(serviceAccountJSON)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

const db = getFirestore()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let limit = parseInt(searchParams.get("limit") || "20", 10)
  if (isNaN(limit) || limit <= 0 || limit > 100) limit = 20

  const startAfterId = searchParams.get("startAfter")
  const topic = searchParams.get("question_topic")

  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    db.collection("questions")

  if (topic) {
    query = query.where("question_topic", "==", topic)
  }

  query = query.orderBy("question_id")

  if (startAfterId) {
    const startAfterDoc = await db
      .collection("questions")
      .doc(startAfterId)
      .get()
    if (startAfterDoc.exists) {
      query = query.startAfter(startAfterDoc)
    }
  }

  // Fetch one extra to check for more pages
  query = query.limit(limit + 1)

  const snapshot = await query.get()
  const docs = snapshot.docs
  const hasMore = docs.length > limit

  // Slice to limit only if there are more
  const questions = (hasMore ? docs.slice(0, limit) : docs).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const nextCursor = hasMore ? docs[limit].id : null

  return NextResponse.json({
    questions,
    nextCursor,
  })
}
