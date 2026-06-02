const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

const dbPath = path.join(__dirname, 'db.json');

const readDB = () => {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/stocks', (req, res) => {
    try {
        const db = readDB();
        res.json(db.stocks || []);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка чтения базы данных' });
    }
});

app.get('/stocks/:id', (req, res) => {
    try {
        const db = readDB();
        const gameId = req.params.id;
        const game = db.stocks.find(g => String(g.id) === String(gameId));

        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ error: 'Игра не найдена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/stocks', (req, res) => {
    try {
        const db = readDB();
        const newGame = req.body;

        if (!newGame.id) {
            newGame.id = Math.random().toString(36).substring(2, 11);
        }

        if (newGame.likes === undefined) {
            newGame.likes = 0;
        }

        db.stocks.push(newGame);
        writeDB(db);

        res.status(201).json(newGame);
    } catch (err) {
        res.status(500).json({ error: 'Не удалось добавить игру' });
    }
});

app.patch('/stocks/:id', (req, res) => {
    try {
        const db = readDB();
        const gameId = req.params.id;
        const gameIndex = db.stocks.findIndex(g => String(g.id) === String(gameId));

        if (gameIndex !== -1) {

            db.stocks[gameIndex] = { ...db.stocks[gameIndex], ...req.body };
            writeDB(db);
            res.json(db.stocks[gameIndex]);
        } else {
            res.status(404).json({ error: 'Игра не найдена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Не удалось обновить игру' });
    }
});

app.delete('/stocks/:id', (req, res) => {
    try {
        const db = readDB();
        const gameId = req.params.id;
        const updatedStocks = db.stocks.filter(g => String(g.id) !== String(gameId));

        if (db.stocks.length !== updatedStocks.length) {
            db.stocks = updatedStocks;
            writeDB(db);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Игра не найдена' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Не удалось удалить игру' });
    }
});

app.listen(PORT, () => {
    console.log(`Полный REST-сервер запущен на http://localhost:${PORT}`);
});
