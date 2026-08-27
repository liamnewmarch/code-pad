import { initializeApp } from "firebase/app"
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth"
import { initializeFirestore, persistentLocalCache } from "firebase/firestore"

const app = initializeApp({
  apiKey: "AIzaSyCXzUiopEMyN3XFUav9LIQ1MLP7X7tpvRw",
  authDomain: "code-pad.web.app",
  projectId: "code-pad",
})

export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
  popupRedirectResolver: browserPopupRedirectResolver,
})

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
