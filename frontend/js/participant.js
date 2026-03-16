document.getElementById("participantForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msgDiv = document.getElementById("msg");
    const token = localStorage.getItem("token");
    
    msgDiv.classList.remove("hidden", "bg-emerald-500/20", "text-emerald-400", "border-emerald-500/20", "bg-red-500/20", "text-red-400", "border-red-500/20");
    msgDiv.textContent = "Adding participant...";

    try {
        const res = await fetch("http://localhost:5000/api/participant/create-participant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            msgDiv.classList.add("bg-emerald-500/20", "text-emerald-400", "border-emerald-500/20");
            msgDiv.textContent = data.message;
            document.getElementById("participantForm").reset();
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            msgDiv.classList.add("bg-red-500/20", "text-red-400", "border-red-500/20");
            msgDiv.textContent = data.message || "Failed to add participant";
        }
    } catch (err) {
        msgDiv.classList.add("bg-red-500/20", "text-red-400", "border-red-500/20");
        msgDiv.textContent = "Server error. Please try again.";
        console.error(err);
    }
});
