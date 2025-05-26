// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAXXVSIjF1NlMzB9BUmds6VvHPrioA11EQ',
  authDomain: 'crud-app-acdc8.firebaseapp.com',
  projectId: 'crud-app-acdc8',
  storageBucket: 'crud-app-acdc8.firebasestorage.app',
  messagingSenderId: '361329255865',
  appId: '1:361329255865:web:d8ad5bf7ceebe337d54268',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
