const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crud.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Banco de dados conectado.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT
  )
`);

module.exports = db;