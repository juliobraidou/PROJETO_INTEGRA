document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("reg-nome").value;
    const email = document.getElementById("reg-email").value;
    const senha = document.getElementById("reg-senha").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(data.error || "Erro ao registrar.");
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
