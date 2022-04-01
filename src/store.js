import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Check if app has been initialized
getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const userStore = {
  user: null,
  errorCode: null,
  errorMessage: null,
  justCreated: false,

  createAccount(email, password) {
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
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      this.errorCode = error.code;
      this.errorMessage = error.message;
    });
  },
};

export default userStore;
