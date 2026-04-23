import { initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
} from "firebase/auth"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  initializeFirestore,
  persistentLocalCache,
  Timestamp,
  updateDoc,
} from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyCXzUiopEMyN3XFUav9LIQ1MLP7X7tpvRw",
  authDomain: "code-pad.web.app",
  projectId: "code-pad",
})

export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})

export {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  Timestamp,
  updateDoc,
}

export function resolveOffline(action, { timeout = 1000 } = {}) {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      setTimeout(resolve, timeout)
      resolve(action)
    } else {
      requestIdleCallback(resolve, { timeout })
    }
  })
}
