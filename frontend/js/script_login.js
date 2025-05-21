document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
        localStorage.setItem("token", data.token); // ✅ adiciona o token

        alert("Login realizado com sucesso!");
        window.location.href = "biblioteca.html"; // ✅ redireciona
      } else {
        alert(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const eyeIcon = document.querySelector(".eye-icon");
  const passwordInput = document.querySelector('input[type="password"]');

  eyeIcon.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeIcon.textContent = isPassword ? "👁‍🗨" : "👁️";
  });
});
