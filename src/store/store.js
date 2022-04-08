import { initializeApp } from 'firebase/app';

const user = {
  userCredential: null,
  settings: {
    first_name: '',
    last_name: '',
    phone_number: '',
    favorite_organization: '',
    favorite_space: '',
    organization_name: '',
    notifications: [],
  },
  clearUser() {
    this.userCredential = null;
    this.settings = {
      first_name: '',
      last_name: '',
      phone_number: '',
      favorite_organization: '',
      favorite_space: '',
      organization_name: '',
      notifications: [],
    };
  },
};

const APIkey = 'fb3f8c4acaba36f086776e594b64a68c';

const error = {
  message: '',
  code: '',
};

const app = initializeApp({
  apiKey: 'AIzaSyCBg6Qdq-gOWa3yA_9zP62mzXRv8yDi7sI',
  authDomain: 'operable-windows.firebaseapp.com',
  databaseURL: 'https://operable-windows-default-rtdb.firebaseio.com',
  projectId: 'operable-windows',
  storageBucket: 'operable-windows.appspot.com',
  messagingSenderId: '379289738007',
  appId: '1:379289738007:web:343a97bc2900ebb8303552',
});

export {
  user, APIkey, error, app,
};
