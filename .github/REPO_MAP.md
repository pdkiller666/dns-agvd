# REPO_MAP — pdkiller666/dns-agvd
> Стек: HTML, CSS, JavaScript | Тип: Веб-приложение (статический сайт)

## Структура
```
dns-agvd/
├── .github/
│   ├── REPO_MAP.md
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── data.js
├── .gitignore
├── AGENT_INSTRUCTIONS.md
├── README.md
└── index.html
```

## Ключевые файлы
- **index.html**: Главная страница приложения, точка входа
- **js/app.js**: Основная логика приложения
- **js/data.js**: Данные и конфигурация
- **css/style.css**: Стилизация интерфейса
- **.github/workflows/ci.yml**: CI/CD пайплайн (проверки)
- **.github/workflows/deploy.yml**: Деплой на продакшен

## Точки входа
- **index.html** — основной файл для запуска (открыть в браузере)
- **js/app.js** — инициализация приложения (подключается в index.html)

## Инварианты (что нельзя менять)
- **index.html** — структура страницы (точка входа)
- **js/app.js** — основная логика (нельзя удалять)
- **js/data.js** — данные (нельзя удалять, можно дополнять)
- **css/style.css** — стили (нельзя удалять)
- **.github/workflows/ci.yml** — CI/CD (нельзя удалять)
- **.github/workflows/deploy.yml** — деплой (нельзя удалять)