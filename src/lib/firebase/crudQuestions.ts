import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "./firebase"
import { Question } from "@/types/questionType"

export const createQuestion = async (uid: string, questionData: Question) => {
  try {
    const newQuestionRef = await doc(db, "questions", uid)
    await setDoc(newQuestionRef, questionData)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

export const updateQuestion = async (
  uid: string,
  newQuestionData: Question
) => {
  try {
    const questionRef = doc(db, "questions", uid)
    await updateDoc(questionRef, newQuestionData)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

export const deleteQuestion = async (uid: string) => {
  try {
    const questionRef = await doc(db, "questions", uid)
    await deleteDoc(questionRef)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}
