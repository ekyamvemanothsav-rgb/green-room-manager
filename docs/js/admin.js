document.getElementById("adminForm").addEventListener("submit", async (e)=>{

e.preventDefault()

const name = document.getElementById("name").value
const email = document.getElementById("email").value
const password = document.getElementById("password").value

const token = localStorage.getItem("token")

const res = await fetch("http://localhost:5000/api/admin/create-admin",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},

body: JSON.stringify({name,email,password})

})

const data = await res.json()

alert(data.message)

})