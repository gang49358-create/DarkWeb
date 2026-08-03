// ===============================
// DARKWEB FIREBASE
// ===============================

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
getAuth 
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
getFirestore 
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Firebase настройки DarkWeb

const firebaseConfig = {

apiKey: "AIzaSyBZD39LQ6QhDcHXcBCKYZ-o7_V4vj-IpHM",

authDomain: "darkweb-73d5e.firebaseapp.com",

projectId: "darkweb-73d5e",

storageBucket: "darkweb-73d5e.firebasestorage.app",

messagingSenderId: "8986350462",

appId: "1:8986350462:web:616b349741e7b4ab58d92f"

};


// Запуск Firebase

const app = initializeApp(firebaseConfig);


// Авторизация

export const auth = getAuth(app);


// База данных

export const db = getFirestore(app);