# REPO_MAP — pdkiller666/dns-agvd
> Стек: HTML, CSS, JavaScript | Тип: Веб-приложение (статический сайт)

## Структура
```
/
├── .github/
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
- **index.html**: Основная HTML-страница приложения
- **js/app.js**: Основная логика приложения
- **js/data.js**: Данные и конфигурация
- **css/style.css**: Стилизация интерфейса
- **.github/workflows/ci.yml**: CI-пайплайн (проверки)
- **.github/workflows/deploy.yml**: Deploy-пайплайн (развёртывание)
- **AGENT_INSTRUCTIONS.md**: Инструкции для агента/разработчика
- **README.md**: Документация проекта
- **.gitignore**: Исключения для Git

## Точки входа
- **index.html** — главная страница, точка входа в приложение
- **js/app.js** — основной скрипт, инициализация приложения

## Инварианты (что нельзя менять)
- **index.html** — структура страницы (точка входа)
- **js/app.js** — основная логика приложения
- **js/data.js** — данные (не менять без согласования)
- **css/style.css** — стилизация (не менять без согласования)
- **.github/workflows/ci.yml** — CI-пайплайн (не менять без согласования)
- **.github/workflows/deploy.yml** — Deploy-пайплайн (не менять без согласования)