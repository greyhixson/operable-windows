import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, getDocs
} from "firebase/firestore"

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCBg6Qdq-gOWa3yA_9zP62mzXRv8yDi7sI",
    authDomain: "operable-windows.firebaseapp.com",
    projectId: "operable-windows",
    storageBucket: "operable-windows.appspot.com",
    messagingSenderId: "379289738007",
    appId: "1:379289738007:web:343a97bc2900ebb8303552"
  });
  
const db = getFirestore(firebaseApp);

export async function getThresholds(city, state) {
  const querySnapshot = await getDocs(collection(db, "window-thresholds"));
  var data;
  querySnapshot.forEach((doc) => {
    if(doc.data().city == city && doc.data().state == state){
      data = doc.data();
    }
  });
  return data;
}


