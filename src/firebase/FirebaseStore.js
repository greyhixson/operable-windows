import { initializeApp } from 'firebase/app';
import {
  // eslint-disable-next-line no-unused-vars
  getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, runTransaction,
} from 'firebase/firestore';

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
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

const APIkey = 'fb3f8c4acaba36f086776e594b64a68c';

// Gets an organization's city, state, and name
async function getOrg(orgName) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, 'organizations', strippedOrg);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

async function getAllOrgs() {
  const querySnapshot = await getDocs(collection(db, 'organizations'));
  const orgs = [];
  querySnapshot.forEach((document) => {
    orgs.push(document.data());
  });
  return orgs;
}

// Gets the window thresholds for a specific space
async function getSpace(orgName, space) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const strippedSpace = space.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

// Gets the window thresholds for all spaces
async function getAllSpaces(orgName) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const querySnapshot = await getDocs(collection(db, `organizations/${strippedOrg}/spaces`));
  const spaces = [];
  querySnapshot.forEach((document) => {
    spaces.push(document.data());
  });
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
    console.log('Transaction failed: ', e);
  }
}

async function newOrg(org) {
  const strippedOrg = org.organization.toLowerCase().replace(/\s+/g, '');
  try {
    const docRef = doc(db, 'organizations', strippedOrg);
    await setDoc(docRef, org, { merge: false });
  } catch (error) {
    this.errorCode = error.code;
    this.errorMessage = error.message;
  }
}

async function newSpace(orgName, spaceObj) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const strippedSpace = spaceObj.space.toLowerCase().replace(/\s+/g, '');
  const docRef = doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace);
  await setDoc(docRef, spaceObj, { merge: true });
}

async function deleteSpace(orgName, spaceObj) {
  const strippedOrg = orgName.toLowerCase().replace(/\s+/g, '');
  const strippedSpace = spaceObj.space.toLowerCase().replace(/\s+/g, '');
  await deleteDoc(doc(db, `organizations/${strippedOrg}/spaces`, strippedSpace));
}

const userStore = {
  userCredential: null,
  errorCode: null,
  errorMessage: null,
  initUser: null,
  settings: {
    first_name: '',
    last_name: '',
    phone_number: '',
    favorite_organization: '',
    favorite_space: '',
    text_notifications: false,
    email_notifications: false,
    organization_name: false,
  },

  createAccount(email, password) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.initUser = false;
        this.userCredential = userCredential;
        sendEmailVerification(auth.currentUser).then(() => {
        });
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      });
  },
  async addUser() {
    if (this.userCredential && this.initUser === false) {
      const docRef = doc(db, 'users', this.userCredential.user.uid);
      await setDoc(docRef, this.settings, { merge: true });
      this.initUser = true;
    }
  },
  async signIn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        this.userCredential = userCredential;
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
      });
  },
  signOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.userCredential = null;
    }).catch((error) => {
      this.errorCode = error.code;
      this.errorMessage = error.message;
    });
  },

  sendPasswordResetEmail() {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.userCredential.user.email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
        // ..
      });
  },
  async getSettings() {
    if (this.userCredential.user.uid) {
      const docRef = doc(db, 'users', this.userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.settings = docSnap.data();
      }
    }
  },

  async updateSettings(settingsObj) {
    if (this.userCredential.user.uid) {
      const docRef = doc(db, 'users', this.userCredential.user.uid);
      try {
        await runTransaction(db, async (transaction) => {
          const settingsDoc = await transaction.get(docRef);
          if (!settingsDoc.exists()) {
            throw new Error('Document does not exist!');
          }
          const updatedSpace = Object.assign(settingsDoc.data(), settingsObj);
          transaction.update(docRef, updatedSpace);
        });
      } catch (e) {
        console.log('Transaction failed: ', e);
      }
    }
    return null;
  },
};

export {
  APIkey,
  getAllOrgs,
  getOrg,
  getSpace,
  getAllSpaces,
  updateSpace,
  newSpace,
  newOrg,
  deleteSpace,
  userStore,
};
