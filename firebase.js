import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

  const firebaseConfig = {
    apiKey: "removed for security purposes",
    authDomain: "removed for security purposes",
    projectId: "removed for security purposes",
    storageBucket: "removed for security purposes",
    messagingSenderId: "removed for security purposes",
    appId: "removed for security purposes",
    measurementId: "removed for security purposes"
  };

  

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  

  export { firebaseApp, db, auth, storage };
