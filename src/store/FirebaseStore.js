import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, runTransaction,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword, signOut as firebaseSignOut,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import userStore from '@/store/UserStore';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCBg6Qdq-gOWa3yA_9zP62mzXRv8yDi7sI',
  authDomain: 'operable-windows.firebaseapp.com',
  projectId: 'operable-windows',
  storageBucket: 'operable-windows.appspot.com',
  messagingSenderId: '379289738007',
  appId: '1:379289738007:web:343a97bc2900ebb8303552',
});

const db = getFirestore(firebaseApp);

const APIkey = 'fb3f8c4acaba36f086776e594b64a68c';

// eslint-disable-next-line import/no-mutable-exports
const error = {
  message: '',
  code: '',
};
// Firestore functions
async function getSettings() {
  try {
    if (userStore.userCredential.user.uid) {
      const docRef = doc(db, 'users', userStore.userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        userStore.settings = docSnap.data();
      } else {
        userStore.clearUserStore();
      }
    }
  } catch (e) {
    error.message = e;
  }
}

async function updateSettings() {
  if (userStore.userCredential.user.uid) {
    const docRef = doc(db, 'users', userStore.userCredential.user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const settingsDoc = await transaction.get(docRef);
        if (!settingsDoc.exists()) {
          throw new Error('Document does not exist!');
        }
        const updatedSpace = Object.assign(settingsDoc.data(), Object(userStore.settings));
        transaction.update(docRef, updatedSpace);
      });
    } catch (e) {
      error.message = e;
    }
  }
}

async function newOrg(org) {
  const strippedOrg = org.organization.toLowerCase().replace(/\s+/g, '');
  try {
    const docRef = doc(db, 'organizations', strippedOrg);
    await setDoc(docRef, org, { merge: false });
    userStore.settings.organization_name = org.organization;
    await updateSettings();
  } catch (e) {
    error.message = e;
  }
}

async function newSpace(orgName, spaceObj) {
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const strippedSpace = spaceObj.space.toLowerCase().replace(/\s+/g, '');
    const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
    await setDoc(docRef, spaceObj, { merge: true });
  } catch (e) {
    error.message = e;
  }
}

// User store and firestore functions
async function addUser() {
  try {
    if (userStore.userCredential) {
      const docRef = doc(db, 'users', userStore.userCredential.user.uid);
      await setDoc(docRef, userStore.settings, { merge: true });
      await getSettings();
    }
  } catch (e) {
    error.message = e;
  }
}

// Gets an organization's city, state, and name
async function getOrg(orgName) {
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const docRef = doc(db, 'organizations', strippedOrg);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    error.message = e;
  }
  return null;
}

async function getAllOrgs() {
  const orgs = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'organizations'));
    querySnapshot.forEach((document) => {
      orgs.push(document.data());
    });
  } catch (e) {
    error.message = e;
  }
  return orgs;
}

// Gets the window thresholds for a specific space
async function getSpace(orgName, space) {
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const strippedSpace = space.toLowerCase().replace(/\s+/g, '');
    const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (e) {
    error.message = e;
  }
  return null;
}

// Gets the window thresholds for all spaces
async function getAllSpaces(orgName) {
  const spaces = [];
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const querySnapshot = await getDocs(collection(db, `organizations/${strippedOrg}/spaces`));
    querySnapshot.forEach((document) => {
      spaces.push(document.data());
    });
  } catch (e) {
    error.message = e;
  }
  return spaces;
}

async function updateSpace(orgName, spaceObj) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const strippedSpace = spaceObj.space.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
  try {
    await runTransaction(db, async (transaction) => {
      const spaceDoc = await transaction.get(docRef);
      if (!spaceDoc.exists()) {
        throw new Error('Document does not exist!');
      }
      const updatedSpace = Object.assign(spaceDoc.data(), spaceObj);
      transaction.update(docRef, updatedSpace);
    });
  } catch (e) {
    error.message = e;
  }
}

async function deleteOrg(orgName) {
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    await deleteDoc(doc(db, 'organizations', strippedOrg));
    userStore.settings.organization_name = '';
    await updateSettings();
  } catch (e) {
    error.message = e;
  }
}

async function deleteSpace(orgName, spaceObj) {
  try {
    const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
    const strippedSpace = spaceObj.space.toLowerCase().replace(/\s+/g, '');
    await deleteDoc(doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace));
  } catch (e) {
    error.message = e;
  }
}

async function deleteUserSettings() {
  try {
    await deleteDoc(doc(db, 'users', userStore.userCredential.user.uid));
    await getSettings();
  } catch (e) {
    error.message = e;
  }
}

// Firebase Authentication functions
async function createAccount(email, password) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      userStore.userCredential = userCredential;
      sendEmailVerification(auth.currentUser).then(() => {
      }).then(async () => {
        await addUser();
        await getSettings();
      });
    })
    .catch((e) => {
      error.message = e.message;
      error.code = e.code;
    });
}

function signIn(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      userStore.userCredential = userCredential;
      await getSettings();
    })
    .catch((e) => {
      error.message = e;
    });
}

function signOut() {
  const auth = getAuth();
  firebaseSignOut(auth)
    .then(async () => {
      userStore.userCredential = null;
      await getSettings();
    }).catch((e) => {
      error.message = e.message;
      error.code = e.code;
    });
}

function deleteUser() {
  const auth = getAuth();
  const user = auth.currentUser;
  firebaseDeleteUser(user).then(() => {
    // User deleted.
  }).catch((e) => {
    error.message = e.message;
    error.code = e.code;
  });
}

function sendPasswordResetEmail() {
  const auth = getAuth();
  firebaseSendPasswordResetEmail(auth, userStore.userCredential.user.email)
    .then(() => {
    }).catch((e) => {
      error.message = e.message;
      error.code = e.code;
    });
}

export {
  APIkey,
  error,
  getAllOrgs,
  getAllSpaces,
  getOrg,
  getSpace,
  updateSpace,
  newSpace,
  newOrg,
  createAccount,
  deleteSpace,
  deleteOrg,
  updateSettings,
  sendPasswordResetEmail,
  signOut,
  signIn,
  deleteUserSettings,
  deleteUser,
  addUser,
};
