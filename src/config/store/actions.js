import firebase, { auth, firestore, resolveOffline } from '../firebase';

const defaultData = {
  css: 'html {\n  background-color: #272822;\n  color: #fff;\n}\n',
  html: '<p> Hello, world! </p>\n',
  javascript: 'const p = document.querySelector(\'p\');\n',
  name: 'Untitled',
};

// function projects({ uid }) {
//   return firestore.collection('users').doc(uid).collection('projects');
// }

export async function addProject({ commit, state }, data = defaultData) {
  try {
    const doc = await resolveOffline(firestore
        .collection('users')
        .doc(state.user.uid)
        .collection('projects')
        .add(data));
    commit('addProject', { ...data, key: doc.id });
    return doc.id;
  } catch ({ message }) {
    console.log(message);
  }
}

export async function deleteProject({ commit, state }, { key }) {
  try {
    await resolveOffline(firestore
        .collection('users')
        .doc(state.user.uid)
        .collection('projects')
        .doc(key)
        .delete());
    commit('deleteProject', { key });
  } catch ({ message }) {
    console.log(message);
  }
}

export function init({ commit, dispatch }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      commit('setUser', user);
      dispatch('loadProjects');
    } else {
      commit('setUser', null);
      commit('loaded');
    }
  });
}

export async function loadProjects({ commit, state }) {
  try {
    const projects = await resolveOffline(firestore
        .collection('users')
        .doc(state.user.uid)
        .collection('projects')
        .get());
    for (const doc of projects.docs) {
      commit('addProject', { ...doc.data(), key: doc.id });
    }
    commit('loaded');
  } catch ({ message }) {
    console.log(message);
  }
}

export function signIn() {
  auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
}

export function signOut() {
  auth.signOut();
}

export async function updateProject({ commit, state }, { key, name, value }) {
  try {
    commit('setProject', { key, name, value });
    await resolveOffline(firestore
        .collection('users')
        .doc(state.user.uid)
        .collection('projects')
        .doc(key)
        .update({ [name]: value }));
  } catch ({ message }) {
    console.log(message);
  }
}
