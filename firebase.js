// firebase.js

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyCHxXBSYYJAWe1NO3L5ht_YC7xj0396nCU",

  authDomain:
    "marvel-roadmap.firebaseapp.com",

  projectId:
    "marvel-roadmap",

  storageBucket:
    "marvel-roadmap.firebasestorage.app",

  messagingSenderId:
    "227210185382",

  appId:
    "1:227210185382:web:1513386419fac6339d8267"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export {
  db,
  doc,
  getDoc,
  setDoc,
  onSnapshot
};