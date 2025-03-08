import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDB() {
    return open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
}

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

        CREATE TABLE IF NOT EXISTS Pagos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_usuario INTEGER NOT NULL,
            monto REAL NOT NULL,
            fecha TEXT DEFAULT CURRENT_TIMESTAMP,
            metodo_pago TEXT NOT NULL,
            estado TEXT DEFAULT 'Pendiente',
            FOREIGN KEY(id_usuario) REFERENCES Usuarios(id)
        );
    `);
    console.log("📀 Base de datos SQLite conectada y tablas creadas.");
}

setupDatabase();
export default openDB;
