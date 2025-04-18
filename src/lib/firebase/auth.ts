import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "./firebase"

// Sign in existing users
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { user: userCredential.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

//Sign up new users
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return { user: userCredential.user, error: null }
  } catch (error) {
    const firebaseError = error as FirebaseError
    if (firebaseError.code === "auth/email-already-in-use") {
      return {
        user: null,
        error: new Error(
          "This email is already registered. Please use a different email or try to log in."
        ),
      }
    }
    return { user: null, error }
  }
}

// Sign out users
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error }
  }
}

// Authentication state observer
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback)
}
