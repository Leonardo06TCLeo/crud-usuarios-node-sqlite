const API_URL = "http://localhost:3000/usuarios";

const form = document.getElementById("formUsuario");
const idInput = document.getElementById("id");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("telefone");
const listaUsuarios = document.getElementById("listaUsuarios");
const cancelarBtn = document.getElementById("cancelar");

async function carregarUsuarios() {
  const resposta = await fetch(API_URL);
  const usuarios = await resposta.json();

  listaUsuarios.innerHTML = "";

  usuarios.forEach((usuario) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td>${usuario.telefone || ""}</td>
      <td>
        <button class="editar" onclick="editarUsuario(${usuario.id}, '${usuario.nome}', '${usuario.email}', '${usuario.telefone || ""}')">
          Editar
        </button>
        <button class="excluir" onclick="excluirUsuario(${usuario.id})">
          Excluir
        </button>
      </td>
    `;

    listaUsuarios.appendChild(tr);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const usuario = {
    nome: nomeInput.value,
    email: emailInput.value,
    telefone: telefoneInput.value,
  };

  const id = idInput.value;

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
  }

  limparFormulario();
  carregarUsuarios();
});

function editarUsuario(id, nome, email, telefone) {
  idInput.value = id;
  nomeInput.value = nome;
  emailInput.value = email;
  telefoneInput.value = telefone;
}

async function excluirUsuario(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este usuário?");

  if (!confirmar) {
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  carregarUsuarios();
}

function limparFormulario() {
  idInput.value = "";
  nomeInput.value = "";
  emailInput.value = "";
  telefoneInput.value = "";
}

cancelarBtn.addEventListener("click", limparFormulario);

carregarUsuarios();