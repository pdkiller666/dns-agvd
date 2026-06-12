# AGENT_INSTRUCTIONS

## Stack
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome (CDN)
- GitHub Pages (статический хостинг)

## Architecture
- Одностраничное приложение (SPA) без фреймворков
- Данные товаров хранятся в отдельном JS-файле (data.js)
- Корзина сохраняется в localStorage
- Lazy loading через Intersection Observer
- Модульная структура: HTML, CSS, JS разделены

## Key files
- `index.html` — главная страница (семантическая верстка, хедер, каталог, корзина, форма, футер)
- `css/style.css` — все стили (адаптив, анимации, цвета)
- `js/data.js` — массив товаров (9 товаров, 3 категории)
- `js/app.js` — вся логика (фильтрация, корзина, валидация, lazy loading)
- `README.md` — документация
- `.gitignore` — стандартный для статики
- `.github/workflows/ci.yml` — CI (проверка HTML/CSS/JS, отсутствие заглушек)

## Constraints
- Максимум 10 файлов
- Нет серверной части (чистая статика)
- Нет deploy.yml (только CI)
- Все тексты реальные, без заглушек
- Адаптив от 320px до 1920px
- Основной цвет: #FF6B00
- Контраст текста не менее 4.5:1

## Dev commands
- Открыть index.html в браузере
- Для проверки: npx html-validate index.html, npx stylelint css/*.css, npx eslint js/*.js
- Для публикации: GitHub Pages из ветки main