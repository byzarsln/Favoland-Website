// Check if user is already logged in and redirect if true
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  window.location.href = "/dashboard"; // Redirect to dashboard page
}

document.getElementById("signinForm").onsubmit = function (e) {
  e.preventDefault();
  handleSignin();
};

async function handleSignin() {
  const username = $("#username").val();
  const password = $("#password").val();

  try {
    const response = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard"; // Navigate to dashboard page
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
}
