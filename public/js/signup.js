// Check if user is already logged in and redirect if true
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  window.location.href = "/dashboard"; // Redirect to dashboard page
}

document.getElementById("signupForm").onsubmit = async function (e) {
  e.preventDefault();
  handleSignup();
};

async function handleSignup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (response.status === 201) {
      window.location.href = "/"; // Navigate to home page
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
}
