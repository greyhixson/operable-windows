import { initializeApp } from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCBg6Qdq-gOWa3yA_9zP62mzXRv8yDi7sI",
    authDomain: "operable-windows.firebaseapp.com",
    projectId: "operable-windows",
    storageBucket: "operable-windows.appspot.com",
    messagingSenderId: "379289738007",
    appId: "1:379289738007:web:343a97bc2900ebb8303552"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);