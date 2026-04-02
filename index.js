const express = require('express');
const sql = require('mssql');
const app = express();

app.use(express.json());

// DB config
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// 👉 Use connection pool properly
let pool;
async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log("Connected to DB ✅");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}
connectDB();

// 👉 GET all users
app.get('/data', async (req, res) => {
    try {
        const result = await pool.request().query("SELECT * FROM Users");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👉 ADD user
app.post('/addUser', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        await pool.request()
            .input('name', sql.VarChar, name)
            .query("INSERT INTO Users (name) VALUES (@name)");

        res.json({ message: "User added successfully ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👉 DELETE user
app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Users WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 👉 Test route
app.get('/', (req, res) => {
    res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
