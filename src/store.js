import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const auth = getAuth();

const userStore = {
  user: null,
  errorCode: null,
  errorMessage: null,

  createAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.user = userCredential;
        // ...
        sendEmailVerification(auth.currentUser).then(() => {
          // Email verification sent!
          // ...
        });
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
        // ..
      });
  },

};

export default userStore;
