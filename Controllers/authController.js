const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
require("dotenv").config();
const db = require("../database");

const generarToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

// 🟢 Registrar Usuario
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, contraseña, rol } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const result = await db.run(
      `INSERT INTO Usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)`,
      [nombre, email, hashedPassword, rol]
    );

    const usuario = { id: result.lastID, email, rol };
    const token = generarToken(usuario);
    res.json({ usuario, token });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// 🔑 Iniciar Sesión
exports.login = async (req, res) => {
  const { email, contraseña } = req.body;
  try {
    const usuario = await db.get("SELECT * FROM Usuarios WHERE email = ?", [email]);

    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValido) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = generarToken(usuario);
    res.json({ usuario, token });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};
const inscribirUsuario = async (req, res) => {
    const { id_evento, id_usuario } = req.body;

    try {
        console.log(`✅ Usuario ${id_usuario} inscrito en evento ${id_evento}`);

        // Simulación de envío de email
        console.log(`📧 Enviando confirmación de inscripción...`);
        console.log(`📨 ¡Correo enviado con éxito al usuario ${id_usuario}!`);

        // Simulación de envío de SMS
        console.log(`📱 Enviando SMS de confirmación...`);
        console.log(`📩 ¡SMS enviado con éxito al usuario ${id_usuario}!`);

        res.status(200).json({ mensaje: "Inscripción exitosa" });
    } catch (error) {
        console.error("❌ Error al inscribir usuario:", error);
        res.status(500).json({ mensaje: "Error al inscribir usuario" });
    }
};

