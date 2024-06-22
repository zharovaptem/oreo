const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('plans.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the plans database.');
});

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT,
    task TEXT,
    UNIQUE(date, time)
)`);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.'));

// Получение задач на определенную дату
app.get('/tasks', (req, res) => {
    const date = req.query.date;
    db.all('SELECT time, task FROM tasks WHERE date = ?', [date], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Добавление, обновление или удаление задачи
app.post('/task', (req, res) => {
    const { date, time, task } = req.body;

    // Проверяем, пустое ли поле задачи
    if (task.trim() === '') {
        // Поле задачи пустое, удаляем запись из базы данных
        db.run('DELETE FROM tasks WHERE date = ? AND time = ?', [date, time], function(err) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Произошла ошибка при удалении задачи");
                return;
            }
            if (this.changes === 0) {
                res.send("Такой задачи не найдено для удаления.");
            } else {
                res.send("Задача успешно удалена.");
                console.log(`Задача успешно удалена`);
            }
        });
    } else {
        // Поле задачи не пустое, добавляем или обновляем запись в базе данных
        db.run('INSERT OR REPLACE INTO tasks (date, time, task) VALUES (?, ?, ?)', [date, time, task.trim()], (err) => {
            if (err) {
                console.log(err.message);
                res.status(500).send("Ошибка при добавлении или обновлении задачи");
                return;
            }
            res.send("Задача добавлена или обновлена");
            console.log(`Задача добавлена или обновлена`);
        });
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:${port}`);
});
