import { initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth"
import { initializeFirestore, persistentLocalCache } from "firebase/firestore"

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
