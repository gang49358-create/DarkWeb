// ==================================
// DARKWEB APP.JS v1
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
getDoc,
updateDoc,
collection,
addDoc,
getDocs,
onSnapshot,
query,
orderBy,
serverTimestamp

}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==================================
// РЕГИСТРАЦИЯ
// ==================================

const registerForm =
document.getElementById("registerForm");


if(registerForm){


registerForm.addEventListener("submit", async(e)=>{


e.preventDefault();


const username =
document.getElementById("username").value.trim();


const email =
document.getElementById("registerEmail").value.trim();


const password =
document.getElementById("registerPassword").value;



try{


const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);



await setDoc(

doc(db,"users",result.user.uid),

{

username:
username.startsWith("@")
?
username
:
"@"+username,

email:email,

description:"",

created:
new Date()

}

);



alert("DarkWeb аккаунт создан 🟢");


window.location.href="home.html";


}

catch(error){

alert(error.message);

}


});


}





// ==================================
// ВХОД
// ==================================

const loginForm =
document.getElementById("loginForm");


if(loginForm){


loginForm.addEventListener("submit",async(e)=>{


e.preventDefault();


const email =
document.getElementById("email").value.trim();


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

alert(
"Ошибка входа: "
+
error.message
);

}


});


}





// ==================================
// ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
// ==================================

onAuthStateChanged(auth,(user)=>{


const protectedPages=[

"home.html",
"profile.html",
"contacts.html",
"chat.html"

];


const page =
window.location.pathname;



if(

protectedPages.some(
(item)=>page.includes(item)
)

&&
!user

){


window.location.href="login.html";


}



});






// ==================================
// ВЫХОД
// ==================================

const logout =
document.getElementById("logout");


if(logout){


logout.onclick=async()=>{


await signOut(auth);


window.location.href="login.html";


};


}





// ==================================
// ПРОФИЛЬ
// ==================================

const profileUsername =
document.getElementById("profileUsername");


const description =
document.getElementById("description");


const saveProfile =
document.getElementById("saveProfile");



if(profileUsername){


onAuthStateChanged(auth,async(user)=>{


if(user){


const snap =
await getDoc(
doc(db,"users",user.uid)
);



if(snap.exists()){


const data =
snap.data();



profileUsername.innerText =
data.username;



description.value =
data.description || "";


}


}


});


}




if(saveProfile){


saveProfile.onclick=async()=>{


const user =
auth.currentUser;


if(!user)return;



await updateDoc(

doc(db,"users",user.uid),

{

description:
description.value

}

);



alert("Профиль обновлён 🟢");


};


}






// ==================================
// ПОИСК ПОЛЬЗОВАТЕЛЕЙ
// ==================================

const searchButton =
document.getElementById("searchButton");


const searchInput =
document.getElementById("searchUser");


const results =
document.getElementById("results");



if(searchButton){


searchButton.onclick=async()=>{


const search =
searchInput.value.trim();



results.innerHTML="";



const users =
await getDocs(
collection(db,"users")
);



users.forEach((item)=>{


const data =
item.data();



if(

data.username === search
||
data.username === "@"+search.replace("@","")

){


results.innerHTML += `

<div class="user-result">

<h3>${data.username}</h3>

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
// ОБЩИЙ ЧАТ
// ==================================

const sendMessage =
document.getElementById("sendMessage");


const messageInput =
document.getElementById("messageInput");


const messages =
document.querySelector(".messages");



if(sendMessage){


sendMessage.onclick=async()=>{


const text =
messageInput.value.trim();



if(!text)return;



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




if(messages){


const q =
query(

collection(db,"messages"),

orderBy("time")

);



onSnapshot(q,(snap)=>{


messages.innerHTML="";


snap.forEach((item)=>{


const data =
item.data();



messages.innerHTML += `

<div class="message">

${data.text}

</div>

`;


});


});


}