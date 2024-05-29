// Redirect to sign-in page if user is not logged in
const user = JSON.parse(localStorage.getItem("user"));
const userId = user ? user._id : null;

if (!userId) {
  window.location.href = "/signin";
}

// Handle change password form submission
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", handleChangePassword);

async function handleChangePassword(event) {
  event.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!userId) {
    alert("User not found");
    return;
  }

  try {
    const response = await fetch("/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: userId,
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await response.json();
    alert(data.message);

    if (data.message === "Password updated successfully") {
      window.location.href = "/dashboard";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
