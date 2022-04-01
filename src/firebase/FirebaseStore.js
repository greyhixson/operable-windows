import { initializeApp } from 'firebase/app';
import {
  // eslint-disable-next-line no-unused-vars
  getFirestore, collection, getDocs, doc, getDoc,
} from 'firebase/firestore';

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCBg6Qdq-gOWa3yA_9zP62mzXRv8yDi7sI',
  authDomain: 'operable-windows.firebaseapp.com',
  projectId: 'operable-windows',
  storageBucket: 'operable-windows.appspot.com',
  messagingSenderId: '379289738007',
  appId: '1:379289738007:web:343a97bc2900ebb8303552',
});

const db = getFirestore(firebaseApp);

// Gets an organization's city and state
async function getOrgCol(org) {
  const strippedOrg = org.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, 'organizations', strippedOrg);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

// Gets the window thresholds for a specific space
async function getOrgSpace(org, space) {
  const strippedOrg = org.toLowerCase().replace(/\s+/g, '');
  const strippedSpace = space.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

// Gets the window thresholds for all spaces
async function getAllOrgSpaces(org) {
  const strippedOrg = org.toLowerCase().replace(/\s+/g, '');
  const querySnapshot = await getDocs(collection(db, `organizations/${strippedOrg}/spaces`));
  const spaces = [];
  querySnapshot.forEach((document) => {
    spaces.push(document.data());
  });
  return spaces;
}

const userStore = {
  user: null,
  errorCode: null,
  errorMessage: null,
  justCreated: false,

  createAccount(email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.user = userCredential;
        this.justCreated = true;
        sendEmailVerification(auth.currentUser).then(() => {
        });
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
        // ..
      });
  },

  signIn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.user = userCredential;
        // ...
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      });
  },

  signOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.user = null;
    }).catch((error) => {
      this.errorCode = error.code;
      this.errorMessage = error.message;
    });
  },
};

export {
  getOrgCol, getOrgSpace, getAllOrgSpaces, userStore,
};
