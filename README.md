# gb-nodejs-l6
Для запуска используйте команду `npm install && node main`

## Требования
Версия NodeJS >= 6

## Структура
* `main.js` - входная точка приложения
* `config.js` - содержит параметры для запуска БД
* `note.js` - модль записей
* `db.sql` - скрипт создания таблицы `todos`
* `core/db.js` - небольшая обёртка над `mysql.pool`
* `core/query.js` - прослойка между моделью и БД, предоставляющая CRUD