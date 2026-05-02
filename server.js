const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do CRUD funcionando.");
});

// Listar usuários
app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.json(rows);
  });
});

// Cadastrar usuário
app.post("/usuarios", (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "Nome e email são obrigatórios." });
  }

  db.run(
    "INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)",
    [nome, email, telefone],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        nome,
        email,
        telefone,
      });
    }
  );
});

// Editar usuário
app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  db.run(
    "UPDATE usuarios SET nome = ?, email = ?, telefone = ? WHERE id = ?",
    [nome, email, telefone, id],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      res.json({ mensagem: "Usuário atualizado com sucesso." });
    }
  );
});

// Excluir usuário
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM usuarios WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    res.json({ mensagem: "Usuário excluído com sucesso." });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});