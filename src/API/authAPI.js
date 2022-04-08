import {
  createUserWithEmailAndPassword, deleteUser as firebaseDeleteUser,
  getAuth,
  sendEmailVerification, sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword, signOut as firebaseSignOut,
} from 'firebase/auth';
import { error, user } from '@/store/store';
import Vue from 'vue';
import { addUser, getSettings } from '@/API/firestoreAPI';

let auth = null;

async function createAccount(email, password) {
  auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user.userCredential = userCredential;
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
  auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      user.userCredential = userCredential;
      await getSettings();
      Vue.$cookies.set('settings', user.settings);
    })
    .catch((e) => {
      error.message = e;
    });
}

function signOut() {
  firebaseSignOut(auth)
    .then(async () => {
      user.userCredential = null;
      await getSettings();
    }).catch((e) => {
      error.message = e.message;
      error.code = e.code;
    });
}

function deleteUser() {
  const userAuth = auth.currentUser;
  firebaseDeleteUser(userAuth).then(() => {
    // User deleted.
  }).catch((e) => {
    error.message = e.message;
    error.code = e.code;
  });
}

function sendPasswordResetEmail() {
  firebaseSendPasswordResetEmail(auth, user.userCredential.user.email)
    .then(() => {
    }).catch((e) => {
      error.message = e.message;
      error.code = e.code;
    });
}

export {
  createAccount, signIn, signOut, deleteUser, sendPasswordResetEmail,
};
