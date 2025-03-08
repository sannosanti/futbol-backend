import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" })); // Asegura que CORS permita todas las conexiones
app.use(express.json());

// 📌 Conectar a la base de datos SQLite
async function openDB() {
    return open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
}

// 📌 Crear tablas si no existen
async function setupDatabase() {
    const db = await openDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            contraseña TEXT NOT NULL,
            rol TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fecha TEXT NOT NULL,
            costo REAL NOT NULL,
            descripcion TEXT
        );

        CREATE TABLE IF NOT EXISTS Inscripciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_evento INTEGER NOT NULL,
            id_usuario INTEGER NOT NULL,
            fecha_inscripcion TEXT DEFAULT CURRENT_TIMESTAMP,
            estado_pago TEXT DEFAULT 'Pendiente',
            FOREIGN KEY(id_evento) REFERENCES Eventos(id),
            FOREIGN KEY(id_usuario) REFERENCES Usuarios(id)
        );
    `);

    console.log("📌 Base de datos SQLite conectada y tablas creadas.");
}

setupDatabase();

// 📌 Ruta raíz para comprobar el servidor
app.get("/", (req, res) => {
    res.send("🚀 Servidor funcionando correctamente");
});

// 📌 Ruta para obtener eventos
app.get("/api/eventos", async (req, res) => {
    const db = await openDB();
    const eventos = await db.all("SELECT * FROM Eventos");
    res.json(eventos);
});

// 📌 Ruta para inscribirse a un evento
app.post("/api/inscripciones", async (req, res) => {
    const { id_evento, id_usuario } = req.body;
    if (!id_evento || !id_usuario) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const db = await openDB();
    try {
        await db.run(
            "INSERT INTO Inscripciones (id_evento, id_usuario) VALUES (?, ?)",
            [id_evento, id_usuario],
        );
        res.json({ mensaje: "Inscripción realizada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al inscribirse" });
    }
});

// 📌 Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
    // Asegura que está disponible en cualquier IP
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
