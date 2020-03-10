import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyCXzUiopEMyN3XFUav9LIQ1MLP7X7tpvRw',
  authDomain: 'code-pad.web.app',
  projectId: 'code-pad',
});

export default firebase;
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export function resolveOffline(action, { timeout = 1000 } = {}) {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      setTimeout(resolve, timeout);
      resolve(action);
    } else {
      requestIdleCallback(resolve, { timeout });
    }
  });
}

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firestore.enablePersistence();
