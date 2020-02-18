import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyCXzUiopEMyN3XFUav9LIQ1MLP7X7tpvRw',
  authDomain: 'code-pad.web.app',
  projectId: 'code-pad',
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export function signIn() {
  return auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
}

export const { signOut } = auth;
