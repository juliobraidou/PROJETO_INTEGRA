document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".close");
  const bookForm = document.getElementById("bookForm");
  const bookList = document.getElementById("bookList");
  const bookQuantity = document.getElementById("bookQuantity");
  const profileImageInput = document.getElementById("profileImageInput");
  const userProfilePic = document.getElementById("userProfilePic");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // ========== PERFIL DO USUÁRIO ==========
  function carregarPerfilUsuario() {
    fetch("http://localhost:3000/usuario", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((usuario) => {
        document.getElementById("userName").textContent = usuario.nome;
        if (usuario.foto_perfil) {
          userProfilePic.src = usuario.foto_perfil;
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil do usuário:", err);
      });
  }

  carregarPerfilUsuario();

  // ========== TROCAR FOTO DE PERFIL ==========
  userProfilePic.addEventListener("click", () => {
    profileImageInput.click();
  });

  profileImageInput.addEventListener("change", () => {
    const file = profileImageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;

      fetch("http://localhost:3000/usuario/foto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foto_perfil: base64Image }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            userProfilePic.src = base64Image;
            alert("Foto de perfil atualizada com sucesso!");
          } else {
            alert("Erro ao atualizar foto de perfil.");
          }
        })
        .catch((err) => {
          console.error("Erro ao enviar imagem:", err);
        });
    };

    reader.readAsDataURL(file);
  });

  // ========== LIVROS ==========
  let totalBooks = 0;

  function criarLivroElement(livro) {
    const img = document.createElement("img");
    img.src = livro.capa || "img/default-book.png";
    img.alt = livro.titulo;
    img.title = `${livro.titulo} - ${livro.autor}`;
    img.style.cursor = "pointer";
    
    // Abrir modal com os detalhes
    img.addEventListener("click", () => abrirModalDetalhes(livro));

    return img;
  }

  function addBookToListDOM(livro) {
    const newBookImg = criarLivroElement(livro);
    const emptySlot = document.querySelector(".book-slot.vazio");

    if (emptySlot) {
      emptySlot.replaceWith(newBookImg);
    } else {
      const addBookContainer = document.querySelector(".add-book-container");
      bookList.insertBefore(newBookImg, addBookContainer);
    }

    totalBooks++;
    bookQuantity.textContent = totalBooks;
  }

  function carregarLivrosDoUsuario() {
    fetch("http://localhost:3000/livros", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((livros) => {
        livros.forEach(addBookToListDOM);
      })
      .catch((err) => {
        console.error("Erro ao carregar livros:", err);
      });
  }

  carregarLivrosDoUsuario();

  // ========== MODAL ==========
  openModalBtn.addEventListener("click", () => (modal.style.display = "flex"));
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // ========== ADICIONAR LIVRO ==========
  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    const novoLivro = {
      titulo: formData.get("nome"),
      autor: formData.get("autor"),
      genero: formData.get("genero"),
      nota: parseFloat(formData.get("nota")),
      comentario: formData.get("comentario"),
    };

    const capa = formData.get("capa");
    if (capa && capa.size > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        novoLivro.capa = event.target.result;
        enviarLivroParaAPI(novoLivro);
      };
      reader.readAsDataURL(capa);
    } else {
      novoLivro.capa = "";
      enviarLivroParaAPI(novoLivro);
    }
  });

  function enviarLivroParaAPI(livro) {
    fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(livro),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          addBookToListDOM(livro);
          modal.style.display = "none";
          bookForm.reset();
        } else {
          alert("Erro ao adicionar livro.");
        }
      })
      .catch((err) => {
        console.error("Erro ao enviar livro:", err);
      });
  }

  const bookDetailsModal = document.getElementById("bookDetailsModal");
  const closeDetailsBtn = document.querySelector(".close-details");

  // Função para abrir modal com os dados
  function abrirModalDetalhes(livro) {
    document.getElementById("modalTitulo").textContent = livro.titulo;
    document.getElementById("modalAutor").textContent = livro.autor;
    document.getElementById("modalGenero").textContent = livro.genero;
    document.getElementById("modalNota").textContent = livro.nota;
    document.getElementById("modalComentario").textContent =
      livro.comentario || "";
    document.getElementById("modalCapa").src =
      livro.capa || "img/default-book.png";
    bookDetailsModal.style.display = "flex";
  }

  // Fecha o modal
  closeDetailsBtn.addEventListener("click", () => {
    bookDetailsModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === bookDetailsModal) bookDetailsModal.style.display = "none";
  });

  // ========== LOGOUT ==========
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
