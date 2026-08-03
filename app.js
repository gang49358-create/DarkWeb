console.log("DarkWeb app.js запущен");
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
<!DOCTYPE html>
<html lang="ru">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>DarkWeb Profile</title>

<link rel="stylesheet" href="style.css">

</head>


<body>


<div class="background"></div>


<div class="profile-page">


<div class="profile-card">


<img id="avatar"
class="avatar-big"
src="assets/avatar.png">


<input 
type="file"
id="avatarInput"
accept="image/*">



<h1 id="profileUsername">
@username
</h1>



<textarea
id="description"
placeholder="Описание профиля">
</textarea>



<label>

<input 
type="checkbox"
id="onlineStatus"
checked>

Показывать Online

</label>



<button id="saveProfile">

Сохранить

</button>



</div>


</div>



<script type="module" src="app.js"></script>


</body>

</html>
// ==================================
// LOAD MINI PROFILE
// ==================================


const miniAvatar =
document.getElementById("miniAvatar");


const userName =
document.getElementById("userName");


const userStatus =
document.getElementById("userStatus");



if(userName){


onAuthStateChanged(auth,async(user)=>{


if(!user)return;



const snap =
await getDoc(

doc(db,"users",user.uid)

);



if(snap.exists()){


const data =
snap.data();



userName.innerText =
data.username;



if(data.online === false){

userStatus.innerText =
"Offline";

userStatus.style.color =
"#777";

}

else{

userStatus.innerText =
"Online";

}



}



});



}




// загрузка локального аватара


if(miniAvatar){


const savedAvatar =
localStorage.getItem(
"darkweb_avatar"
);



if(savedAvatar){

miniAvatar.src =
savedAvatar;

}


}
// ==================================
// DARKWEB CHAT LIST
// ==================================


const chatList =
document.getElementById("chatList");



if(chatList){


onAuthStateChanged(auth,async(user)=>{


if(!user)return;



const users =
await getDocs(
collection(db,"users")
);



chatList.innerHTML="";



users.forEach((item)=>{


if(item.id !== user.uid){


const data =
item.data();



chatList.innerHTML += `


<div class="chat-item"
onclick="openChat('${data.username}')">


<img 
class="chat-avatar"
src="assets/avatar.png">


<div class="chat-info">


<h3>

${data.username}

</h3>


<p>

🟢 Начать диалог

</p>


</div>


</div>


`;



}


});


});


}



// открыть чат


window.openChat=function(username){


window.location.href =
"chat.html?user="+username;


}
// ==================================
// TELEGRAM STYLE PRIVATE CHAT
// ==================================


const chatMessages =
document.getElementById("chatMessages");


const chatInput =
document.getElementById("chatInput");


const sendChat =
document.getElementById("sendChat");



const params =
new URLSearchParams(
window.location.search
);


const chatUsername =
params.get("user");



const chatTitle =
document.getElementById("chatUser");


if(chatTitle){

chatTitle.innerText =
chatUsername;

}



let myUID = null;



onAuthStateChanged(auth,(user)=>{


if(user){


myUID =
user.uid;


loadPrivateMessages();


}


});





async function loadPrivateMessages(){


if(!chatMessages)
return;



const messagesQuery =
query(

collection(db,"messages"),

orderBy("time")

);



onSnapshot(messagesQuery,(snapshot)=>{


chatMessages.innerHTML="";



snapshot.forEach((item)=>{


const data =
item.data();



if(

(data.sender === myUID &&
data.receiver === chatUsername)

||

(data.sender === chatUsername &&
data.receiver === myUID)

){



const mine =
data.sender === myUID;



chatMessages.innerHTML += `


<div class="chat-message 
${mine ? "my-message" : "other-message"}">


${data.text}


<span class="message-time">

${

data.time ?

new Date(
data.time.toDate()
).toLocaleTimeString()

:

""

}

</span>


</div>


`;



}



});



chatMessages.scrollTop =
chatMessages.scrollHeight;



});


}




if(sendChat){


sendChat.onclick=async()=>{


const text =
chatInput.value.trim();



if(!text)return;



await addDoc(

collection(db,"messages"),

{

text:text,

sender:myUID,

receiver:chatUsername,

time:serverTimestamp()

}

);



chatInput.value="";


};


}