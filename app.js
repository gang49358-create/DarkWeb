// ==================================
// DARKWEB APP.JS FINAL
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



// ==========================
// REGISTER
// ==========================

const registerForm =
document.getElementById("registerForm");


if(registerForm){


registerForm.onsubmit = async(e)=>{


e.preventDefault();


const username =
document.getElementById("username").value;


const email =
document.getElementById("registerEmail").value;


const password =
document.getElementById("registerPassword").value;


try{


const user =
await createUserWithEmailAndPassword(
auth,
email,
password
);



await setDoc(

doc(db,"users",user.user.uid),

{

username:
username.startsWith("@")
?
username
:
"@"+username,

email,

online:true,

description:"",

lastOnline:
new Date()

}

);



location.href="home.html";


}

catch(e){

alert(e.message);

}


};


}




// ==========================
// LOGIN
// ==========================


const loginForm =
document.getElementById("loginForm");


if(loginForm){


loginForm.onsubmit = async(e)=>{


e.preventDefault();


try{


await signInWithEmailAndPassword(

auth,

document.getElementById("email").value,

document.getElementById("password").value

);


location.href="home.html";


}

catch(e){

alert(e.message);

}


};


}





// ==========================
// ONLINE SYSTEM
// ==========================


onAuthStateChanged(auth,async(user)=>{


if(user){


await updateDoc(

doc(db,"users",user.uid),

{

online:true,

lastOnline:new Date()

}

);


}



});






// ==========================
// LOGOUT
// ==========================


const logout =
document.getElementById("logout");


if(logout){


logout.onclick=async()=>{


const user =
auth.currentUser;


if(user){


await updateDoc(

doc(db,"users",user.uid),

{

online:false,

lastOnline:new Date()

}

);


}



await signOut(auth);


location.href="login.html";


};


}





// ==========================
// PROFILE
// ==========================


const profileName =
document.getElementById("profileUsername");


const description =
document.getElementById("description");


const saveProfile =
document.getElementById("saveProfile");



if(profileName){


onAuthStateChanged(auth,async(user)=>{


if(!user)return;



const snap =
await getDoc(

doc(db,"users",user.uid)

);



if(snap.exists()){


const data =
snap.data();



profileName.innerText =
data.username;


description.value =
data.description || "";


}


});


}




if(saveProfile){


saveProfile.onclick=async()=>{


const user =
auth.currentUser;


await updateDoc(

doc(db,"users",user.uid),

{

description:
description.value

}

);


alert("Сохранено");


};


}





// ==========================
// SEARCH USERS
// ==========================


const searchButton =
document.getElementById("searchButton");


const searchInput =
document.getElementById("searchUser");


const results =
document.getElementById("results");



if(searchButton){


searchButton.onclick=async()=>{


const users =
await getDocs(
collection(db,"users")
);



results.innerHTML="";



users.forEach((item)=>{


const data =
item.data();



if(
data.username === searchInput.value
){



results.innerHTML += `

<div class="user-result"

onclick="openChat('${item.id}','${data.username}')">


<h3>

${data.username}

</h3>


<span>

${data.online ? "🟢 Online":"⚫ Offline"}

</span>


</div>

`;


}


});


};


}




window.openChat=function(uid,name){


location.href =
"chat.html?uid="+uid+"&name="+name;


};






// ==========================
// PRIVATE CHAT
// ==========================


const chatMessages =
document.getElementById("chatMessages");


const chatInput =
document.getElementById("chatInput");


const sendChat =
document.getElementById("sendChat");


const params =
new URLSearchParams(location.search);


const receiverUID =
params.get("uid");


const receiverName =
params.get("name");



const chatTitle =
document.getElementById("chatUser");


if(chatTitle){

chatTitle.innerText =
receiverName;

}



let myUID=null;



onAuthStateChanged(auth,(user)=>{


if(user){

myUID=user.uid;

loadChat();

}


});



function loadChat(){


if(!chatMessages)return;



const q =
query(

collection(db,"messages"),

orderBy("time")

);



onSnapshot(q,(snap)=>{


chatMessages.innerHTML="";



snap.forEach((item)=>{


const data =
item.data();



if(

(data.sender===myUID &&
data.receiver===receiverUID)

||

(data.sender===receiverUID &&
data.receiver===myUID)

){



chatMessages.innerHTML += `

<div class="chat-message">

${data.text}

</div>

`;

}


});


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

text,

sender:myUID,

receiver:receiverUID,

time:serverTimestamp()

}

);



chatInput.value="";


};


}