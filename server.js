// Импортируем необходимые модули: express для создания сервера,
// cors для настройки CORS и bodyParser для обработки JSON-запросов
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Создаем экземпляр приложения Express
const app = express();

// Используем middleware cors для разрешения запросов из других доменов
app.use(cors());

// Используем middleware bodyParser для обработки JSON-тел запросов
app.use(
  bodyParser.json({
    // Эта функция всегда возвращает true,
    // указывая, что все запросы будут обработаны как JSON
    type(req) {
      return true;
    },
  })
);

// Middleware, который устанавливает заголовок 
//'Content-Type' для всех ответов на 'application/json'
app.use(function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Инициализируем пустой массив для хранения заметок
const notes = [];
// Переменная для генерации уникальных идентификаторов заметок
let nextId = 1;

// Обработчик GET-запросов на путь /notes,
// который возвращает все заметки в формате JSON
app.get("/notes", (req, res) => {
  res.send(JSON.stringify(notes));
});

// Обработчик POST-запросов на путь /notes, который добавляет новую заметку
app.post("/notes", (req, res) => {
  // Добавляем новую заметку в массив,
  // используя данные из тела запроса и уникальный идентификатор
  notes.push({ ...req.body, id: nextId++ });
  // Устанавливаем статус ответа 204 (No Content) и завершаем ответ
  res.status(204);
  res.end();
});

// Обработчик DELETE-запросов на путь /notes/:id,
// который удаляет заметку по заданному идентификатору
app.delete("/notes/:id", (req, res) => {
  // Преобразуем параметр id из строки в число
  const noteId = Number(req.params.id);
  // Ищем индекс заметки с заданным идентификатором
  const index = notes.findIndex((o) => o.id === noteId);
  // Если заметка найдена, удаляем её из массива
  if (index !== -1) {
    notes.splice(index, 1);
  }
  // Устанавливаем статус ответа 204 (No Content) и завершаем ответ
  res.status(204);
  res.end();
});

// Определяем порт для сервера,
// используя переменную окружения PORT или значение по умолчанию 7070
const port = process.env.PORT || 7070;
// Запускаем сервер и выводим сообщение в консоль с указанием адреса сервера
app.listen(port, () => console.log(`The server is running on http://localhost:${port}`));
