const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true
    }
};

app.get('/data', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT GETDATE() AS time`;
        res.json(result.recordset);
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/', (req, res) => {
    res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
