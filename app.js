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
// ==================================
// DARKWEB MESSAGES
// ==================================


import {

collection,
addDoc,
onSnapshot,
query,
orderBy,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const sendButton =
document.getElementById("sendMessage");


const messageInput =
document.getElementById("messageInput");



const messagesBox =
document.querySelector(".messages");



if(sendButton){


sendButton.onclick = async()=>{


const text =
messageInput.value.trim();



if(!text) return;



await addDoc(

collection(db,"messages"),

{

text:text,

time:serverTimestamp()

}

);



messageInput.value="";


};


}





if(messagesBox){


const q =
query(

collection(db,"messages"),

orderBy("time")

);



onSnapshot(q,(snapshot)=>{


messagesBox.innerHTML="";



snapshot.forEach((doc)=>{


const data =
doc.data();



messagesBox.innerHTML += `


<div class="message">


<p>

${data.text}

</p>


</div>


`;


});


});


}
// ==================================
// DARKWEB PROFILE
// ==================================

import {
getDoc,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Элементы профиля

const profileUsername =
document.getElementById("profileUsername");

const descriptionInput =
document.getElementById("description");

const saveProfile =
document.getElementById("saveProfile");



// загрузка профиля

if(profileUsername){


onAuthStateChanged(auth, async(user)=>{


if(user){


const userRef =
doc(db,"users",user.uid);



const userSnap =
await getDoc(userRef);



if(userSnap.exists()){


const data =
userSnap.data();



profileUsername.innerText =
data.username;



descriptionInput.value =
data.description || "";


}



}


});


}




// сохранение описания

if(saveProfile){


saveProfile.onclick = async()=>{


const user =
auth.currentUser;



if(!user) return;



await updateDoc(

doc(db,"users",user.uid),

{

description:
descriptionInput.value

}

);



alert("Профиль сохранён 🟢");


};


}
// ==================================
// SEARCH USERS
// ==================================


import {

collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const searchButton =
document.getElementById("searchButton");


const searchUser =
document.getElementById("searchUser");


const results =
document.getElementById("results");



if(searchButton){


searchButton.onclick = async()=>{


const value =
searchUser.value.trim();



results.innerHTML="";



const users =
await getDocs(
collection(db,"users")
);



users.forEach((item)=>{


const data =
item.data();



if(
data.username === value ||
data.username === "@"+value.replace("@","")
){



results.innerHTML += `


<div class="user-result">

<h3>

${data.username}

</h3>


<span>

🟢 DarkWeb User

</span>


</div>


`;



}



});


};

}
// ==================================
// PRIVATE CHAT
// ==================================

import {

addDoc,
collection,
onSnapshot,
query,
orderBy,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const sendChat =
document.getElementById("sendChat");


const chatInput =
document.getElementById("chatInput");


const chatMessages =
document.getElementById("chatMessages");



const params =
new URLSearchParams(
window.location.search
);



const receiver =
params.get("user");



if(receiver){


document.getElementById("chatUser").innerText =
receiver;


}



if(sendChat){


sendChat.onclick = async()=>{


const text =
chatInput.value.trim();



if(!text) return;



const user =
auth.currentUser;



await addDoc(

collection(db,"messages"),

{

text:text,

sender:user.uid,

receiver:receiver,

time:serverTimestamp()

}

);



chatInput.value="";


};


}