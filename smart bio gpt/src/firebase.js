// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUBnOIpAvCj6_ysl-8XmJ3mRSqEt6Yvps",
  authDomain: "aminoverse-ca296.firebaseapp.com",
  projectId: "aminoverse-ca296",
  storageBucket: "aminoverse-ca296.appspot.com",
  messagingSenderId: "180595165886",
  appId: "1:180595165886:web:a1c44c2d43d6cc64d0ecef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
