import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAie0QM22jlr4Jj3l6mdPXGa5pvdL0WsBM",
  authDomain: "runtime-terror-1d144.firebaseapp.com",
  databaseURL: "https://runtime-terror-1d144.firebaseio.com",
  projectId: "runtime-terror-1d144",
  storageBucket: "runtime-terror-1d144.appspot.com",
  messagingSenderId: "70168581355",
  appId: "1:70168581355:web:5e5d90b4acaa1fa0515aae",
  measurementId: "G-CX98XPJEMS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase