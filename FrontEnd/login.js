document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("mail").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          window.location.href = "index.html";
        } else {
          errorMessage.textContent = "Identifiant ou mot de passe incorrect.";
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        errorMessage.textContent =
          "Une erreur est survenue. Veuillez réessayer plus tard.";
      });
  });
});
