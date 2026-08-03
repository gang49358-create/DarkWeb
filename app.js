// ==================================
// DARKWEB APP.JS
// Авторизация + регистрация
// ==================================

import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
doc,
setDoc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// РЕГИСТРАЦИЯ
// ===============================

const registerForm = document.getElementById("registerForm");


if(registerForm){

registerForm.addEventListener("submit", async(e)=>{

e.preventDefault();


const username =
document.getElementById("username").value;


const email =
document.getElementById("registerEmail").value;


const password =
document.getElementById("registerPassword").value;



try{


const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);



const user =
userCredential.user;



await setDoc(
doc(db,"users",user.uid),
{

username:
username.startsWith("@")
?
username
:
"@"+username,

email:email,

created:
new Date()

}

);



alert("Аккаунт DarkWeb создан 🟢");


window.location.href="home.html";


}

catch(error){

alert(error.message);

}


});


}



// ===============================
// ВХОД
// ===============================


const loginForm =
document.getElementById("loginForm");


if(loginForm){


loginForm.addEventListener("submit",async(e)=>{


e.preventDefault();



const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



try{


await signInWithEmailAndPassword(
auth,
email,
password
);



window.location.href="home.html";


}

catch(error){

alert("Ошибка входа: "+error.message);

}



});


}




// ===============================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ===============================


onAuthStateChanged(auth,(user)=>{


const protectedPages=[

"home.html",
"profile.html",
"settings.html"

];



const page =
window.location.pathname;



if(
protectedPages.some(p=>page.includes(p))
&&
!user
){

window.location.href="login.html";

}


});



// ===============================
// ВЫХОД
// ===============================


const logoutButton =
document.getElementById("logout");


if(logoutButton){


logoutButton.onclick=()=>{


signOut(auth);

window.location.href="login.html";


};


}