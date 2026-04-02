const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: { encrypt: true }
};

app.get('/data', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT GETDATE() AS currentTime`;
        res.json(result.recordset);
    } catch (err) {
        res.send(err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
