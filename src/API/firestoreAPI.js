import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, runTransaction,
} from 'firebase/firestore';

import { app, user, error } from '@/store/store';
import Vue from 'vue';

const db = getFirestore(app);

async function getSettings() {
  try {
    if (user.userCredential) {
      const docRef = doc(db, 'users', user.userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        user.settings = docSnap.data();
      } else {
        user.clearUser();
      }
    }
  } catch (e) {
    error.message = e;
  }
}

async function updateSettings() {
  Vue.$cookies.set('settings', user.settings);
  if (user.userCredential) {
    const docRef = doc(db, 'users', user.userCredential.user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const settingsDoc = await transaction.get(docRef);
        if (!settingsDoc.exists()) {
          throw new Error('Document does not exist!');
        }
        const updatedSpace = Object.assign(settingsDoc.data(), Object(user.settings));
        transaction.update(docRef, updatedSpace);
      });
    } catch (e) {
      error.message = e;
    }
  }
}

async function newOrg(org) {
  const strippedOrg = org.name.toLowerCase().replace(/\s+/g, '');
  try {
    const docRef = doc(db, 'organizations', strippedOrg);
    await setDoc(docRef, org, { merge: false });
    user.settings.organization_name = org.name;
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
    if (user.userCredential) {
      const docRef = doc(db, 'users', user.userCredential.user.uid);
      await setDoc(docRef, user.settings, { merge: true });
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
    user.settings.organization_name = '';
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
    await deleteDoc(doc(db, 'users', user.userCredential.user.uid));
    await getSettings();
  } catch (e) {
    error.message = e;
  }
}

// Firebase Authentication functions

export {
  getAllOrgs,
  getAllSpaces,
  getOrg,
  getSpace,
  updateSpace,
  newSpace,
  newOrg,
  deleteSpace,
  deleteOrg,
  updateSettings,
  deleteUserSettings,
  addUser,
  getSettings,
};
