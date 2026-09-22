import type { User } from "firebase/auth"
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from "firebase/auth"

import { auth } from "../firebase.js"

export function watchUser(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, callback)
}

export async function consumeRedirect(): Promise<void> {
  await getRedirectResult(auth)
}

export async function signIn(): Promise<void> {
  const provider = new GoogleAuthProvider()
  // The redirect flow needs the auth handler to be same-origin with the
  // app, which is only true once deployed. In dev fall back to a popup,
  // which passes the credential back by postMessage instead.
  if (import.meta.env.DEV) {
    await signInWithPopup(auth, provider)
  } else {
    await signInWithRedirect(auth, provider)
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}
