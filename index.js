const express = require('express');
const sql = require('mssql');
const app = express();

// middleware (IMPORTANT for POST)
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

// 👉 Connect once (better practice)
sql.connect(config).then(() => {
    console.log("Connected to DB ✅");
}).catch(err => console.log(err));

// 👉 GET all users
app.get('/data', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Users`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 👉 ADD user (POST)
app.post('/addUser', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send("Name is required");
        }

        await sql.query`INSERT INTO Users (name) VALUES (${name})`;

        res.send("User added successfully ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 👉 Test route
app.get('/', (req, res) => {
    res.send("Backend is running ✅");
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
