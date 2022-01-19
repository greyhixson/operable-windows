import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, where, query, getDocs
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

// TODO: Error handling and hide firebase API
// Gets the window thresholds from firebase given some parameters
export async function getThresholds(city, state) {
  try {
    const thresholds = collection(db, "window-thresholds")
    const q = query(thresholds, where("city", "==", city), where("state", "==", state))
    const querySnapshot = await getDocs(q)
    if(!querySnapshot.empty) {
      const threshold = querySnapshot.docs[0].data()
      return threshold
    }
    else {
      return 'No information was found for that location'
    }
  }
  catch {
    return 'An error has occured, please try again later'
  }

}


