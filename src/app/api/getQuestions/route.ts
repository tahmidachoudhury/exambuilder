import { NextRequest, NextResponse } from "next/server"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

if (!getApps().length) {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  })
}

const db = getFirestore()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "20")
  const searchTerm = searchParams.get("search") || ""
  const startAfterId = searchParams.get("startAfter")

  //need to explicitly type the query
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    db.collection("questions")

  if (searchTerm) {
    query = query
      .orderBy("topic")
      .orderBy("question_id")
      .orderBy("question_topic")
      .startAt(searchTerm)
      .endAt(searchTerm + "\uf8ff")
  } else {
    query = query.orderBy("question_id")
  }

  query = query.limit(limit)

  if (startAfterId) {
    const startAfterDoc = await db
      .collection("questions")
      .doc(startAfterId)
      .get()
    if (startAfterDoc.exists) {
      query = query.startAfter(startAfterDoc)
    }
  }

  const snapshot = await query.get()
  const questions = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  //this is the unique key returned with the response for pagination
  const lastVisible = snapshot.docs[snapshot.docs.length - 1]

  //this will return the next batch of questions from the db
  return NextResponse.json({
    questions,
    nextCursor: lastVisible?.id || null,
  })
}
