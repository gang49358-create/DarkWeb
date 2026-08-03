// ===============================
// DARKWEB FIREBASE CONFIG
// ===============================

// ВАЖНО:
// сюда нужно вставить свои данные из Firebase Console

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



const firebaseConfig = {

apiKey: "ТВОЙ_API_KEY",

authDomain: "ТВОЙ_PROJECT.firebaseapp.com",

projectId: "ТВОЙ_PROJECT_ID",

storageBucket: "ТВОЙ_PROJECT.appspot.com",

messagingSenderId: "ТВОЙ_SENDER_ID",

appId: "ТВОЙ_APP_ID"

};



const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);