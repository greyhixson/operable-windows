import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const auth = getAuth();

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

};

export default userStore;
